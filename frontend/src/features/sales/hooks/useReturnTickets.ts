import { useState, useCallback, useEffect } from 'react'
import { returnTicketService } from '../services/returnTicketService'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'

export type SortField = 'createdAt' | 'updatedAt' | 'money' | 'status'
export type SortOrder = 'asc' | 'desc'

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UseReturnsReturn {
  tickets: ReturnTicketData[]
  pagination: PaginationState
  isLoading: boolean
  error: string | null
  search: string
  setSearch: (v: string) => void
  sortField: SortField
  sortOrder: SortOrder
  handleSort: (field: SortField) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  refresh: () => void
}

const PAGE_SIZE = 8

// ─── Hook: Return Page ──────────────────────────────────────────────────────
// Fetches ALL tickets → filters to unassigned + mine → sorts mine first → paginates 8/page
export function useReturnPageTickets(currentStaffId: string): UseReturnsReturn {
  const [allTickets, setAllTickets] = useState<ReturnTicketData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch from the GENERAL list so we see new (unassigned) tickets too
      const res = await returnTicketService.getAllTickets({ page: 1, limit: 200 })
      if (res.success) {
        setAllTickets(res.data.returnTicketList)
      }
    } catch (err: any) {
      console.error('[useReturnPageTickets] fetch error:', err)
      setError(err?.message || 'Failed to load return tickets')
    } finally {
      setIsLoading(false)
    }
  }, [refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // 1) Filter: only unassigned OR (assigned to me AND PENDING)
  // Returns = Action Items (To-Do)
  const activeTickets = allTickets.filter((t) => {
    const isUnassigned = !t.staffVerify || t.staffVerify === ''
    const isMine = currentStaffId ? t.staffVerify === currentStaffId : false
    const isActiveStatus = t.status === 'PENDING'
    return (isUnassigned || isMine) && isActiveStatus
  })

  // 2) Search
  const afterSearch = search.trim()
    ? activeTickets.filter(
        (t) =>
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.orderId.toLowerCase().includes(search.toLowerCase()) ||
          t.reason.toLowerCase().includes(search.toLowerCase()) ||
          (t.description?.toLowerCase() ?? '').includes(search.toLowerCase())
      )
    : activeTickets

  // 3) Sort: mine first (priority 0) → unassigned (priority 1)
  //    within each group, sort by selected field
  const sorted = [...afterSearch].sort((a, b) => {
    const aPriority = currentStaffId && a.staffVerify === currentStaffId ? 0 : 1
    const bPriority = currentStaffId && b.staffVerify === currentStaffId ? 0 : 1
    if (aPriority !== bPriority) return aPriority - bPriority

    let valA: any = a[sortField as keyof ReturnTicketData]
    let valB: any = b[sortField as keyof ReturnTicketData]
    if (sortField === 'money') {
      valA = Number(valA) || 0
      valB = Number(valB) || 0
    }
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
    return sortOrder === 'asc' ? cmp : -cmp
  })

  // 4) Client-side pagination: 8 per page
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageTickets = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortOrder('desc')
      }
    },
    [sortField]
  )

  return {
    tickets: pageTickets,
    pagination: { page: safePage, limit: PAGE_SIZE, total, totalPages },
    isLoading,
    error,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    currentPage: safePage,
    setCurrentPage,
    refresh: () => setRefreshKey((k) => k + 1)
  }
}

// ─── Hook: Returned Orders (RETURNED / APPROVED / REJECTED) ──────────────────
export function useReturnedOrders(): UseReturnsReturn {
  const [allTickets, setAllTickets] = useState<ReturnTicketData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await returnTicketService.getReturnedOrders(1, 200)
      if (res.success) {
        setAllTickets(res.data.returnTicketList)
      }
    } catch (err: any) {
      console.error('[useReturnedOrders] fetch error:', err)
      setError(err?.message || 'Failed to load returned orders')
    } finally {
      setIsLoading(false)
    }
  }, [refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData()
  }, [fetchData])
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const afterSearch = search.trim()
    ? allTickets.filter(
        (t) =>
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.orderId.toLowerCase().includes(search.toLowerCase()) ||
          t.reason.toLowerCase().includes(search.toLowerCase())
      )
    : allTickets

  const sorted = [...afterSearch].sort((a, b) => {
    let valA: any = a[sortField as keyof ReturnTicketData]
    let valB: any = b[sortField as keyof ReturnTicketData]
    if (sortField === 'money') {
      valA = Number(valA) || 0
      valB = Number(valB) || 0
    }
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageTickets = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortOrder('desc')
      }
    },
    [sortField]
  )

  return {
    tickets: pageTickets,
    pagination: { page: safePage, limit: PAGE_SIZE, total, totalPages },
    isLoading,
    error,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    currentPage: safePage,
    setCurrentPage,
    refresh: () => setRefreshKey((k) => k + 1)
  }
}

// ─── Hook: My Return History (Processed by ME) ───────────────────────────────
export function useMyReturnHistory(): UseReturnsReturn {
  const [allTickets, setAllTickets] = useState<ReturnTicketData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('updatedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await returnTicketService.getMyHistory({ page: 1, limit: 200 })
      if (res.success) {
        setAllTickets(res.data.returnTicketList)
      }
    } catch (err: any) {
      console.error('[useMyReturnHistory] fetch error:', err)
      setError(err?.message || 'Failed to load return history')
    } finally {
      setIsLoading(false)
    }
  }, [refreshKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData()
  }, [fetchData])
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const filtered = allTickets.filter((t: any) =>
    ['IN_PROGRESS', 'APPROVED', 'REJECTED', 'DELIVERING', 'RETURNED'].includes(t.status)
  )

  const afterSearch = search.trim()
    ? filtered.filter(
        (t: any) =>
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.orderId.toLowerCase().includes(search.toLowerCase()) ||
          t.reason.toLowerCase().includes(search.toLowerCase())
      )
    : filtered

  const sorted = [...afterSearch].sort((a, b) => {
    let valA: any = a[sortField as keyof ReturnTicketData]
    let valB: any = b[sortField as keyof ReturnTicketData]
    if (sortField === 'money') {
      valA = Number(valA) || 0
      valB = Number(valB) || 0
    }
    const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageTickets = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortField(field)
        setSortOrder('desc')
      }
    },
    [sortField]
  )

  return {
    tickets: pageTickets,
    pagination: { page: safePage, limit: PAGE_SIZE, total, totalPages },
    isLoading,
    error,
    search,
    setSearch,
    sortField,
    sortOrder,
    handleSort,
    currentPage: safePage,
    setCurrentPage,
    refresh: () => setRefreshKey((k) => k + 1)
  }
}
