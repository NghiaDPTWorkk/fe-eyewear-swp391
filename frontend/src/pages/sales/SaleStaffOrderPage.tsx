import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { IoFlashOutline, IoCubeOutline, IoReceiptOutline, IoRepeatOutline } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import { salesService } from '@/features/sales/services/salesService'

import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { OrderMetrics } from '@/features/sales/components/orders/OrderMetrics'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { OrderTable } from '@/features/sales/components/orders/OrderTable'
import { StatusFilterBar } from '@/features/sales/components/orders/StatusFilterBar'
import { PageHeader, RejectionModal } from '@/features/sales/components/common'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import { type Invoice } from '@/features/sales/types'
import { ConfirmationModal } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'

export default function SaleStaffOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const searchQuery = searchParams.get('search') ?? ''

  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [invoiceToProcess, setInvoiceToProcess] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const limit = 8

  const setSearchQuery = (query: string) => {
    const next = new URLSearchParams(searchParams)
    if (query) next.set('search', query)
    else next.delete('search')
    setSearchParams(next)
  }

  // Reset page to 1 whenever filters change to avoid "empty page" issues
  useEffect(() => {
    setPage(1)
  }, [statusFilter, orderTypeFilter, searchQuery])

  const {
    invoices: invoiceList,
    pagination,
    loading: isLoading,
    fetchInvoices: refetch
  } = useSalesStaffInvoices(page, limit, statusFilter, searchQuery)

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList

    // 1. Pending tab: only show invoices with manufacturing/prescription orders
    if (statusFilter === InvoiceStatus.DEPOSITED) {
      list = list.filter((inv: Invoice) => inv.orders?.some((o) => o.isPrescription))
    }

    // 3. Approved/Refunded tabs: No client filter needed as server handles it.
    // We only keep the Pending (DEPOSITED) specific prescription filter if server can't do it.
    if (statusFilter === InvoiceStatus.DEPOSITED) {
      list = list.filter((inv: Invoice) => inv.orders?.some((o) => o.isPrescription))
    }

    // 4. Search filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv: Invoice) =>
          inv.fullName.toLowerCase().includes(q) ||
          inv.invoiceCode.toLowerCase().includes(q) ||
          inv.phone.includes(q)
      )
    }

    // 5. Order type filter
    if (orderTypeFilter !== 'All') {
      list = list.filter((inv: Invoice) =>
        inv.orders?.some((order) => {
          const types = Array.isArray(order.type) ? order.type : [order.type]
          return types.some((t: OrderType | string) => String(t).includes(orderTypeFilter))
        })
      )
    }

    // 6. Sort by newest first
    list = list.sort((a: Invoice, b: Invoice) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return list
  }, [invoiceList, searchQuery, orderTypeFilter, statusFilter])

  // Total pages sanity check: if list is empty on page 1, force total to 1
  const serverTotal = pagination?.total || 0
  const adjustedTotalPages =
    filteredInvoices.length === 0 && page === 1 ? 1 : pagination?.totalPages || 1

  const paginatedInvoices = filteredInvoices

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }
    invoiceList.forEach((inv: Invoice) => {
      if (inv.orders && inv.orders.length > 0) {
        inv.orders.forEach((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.NORMAL)))
            counts[OrderType.NORMAL]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.MANUFACTURING)))
            counts[OrderType.MANUFACTURING]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.RETURN)))
            counts[OrderType.RETURN]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.PRE_ORDER)))
            counts[OrderType.PRE_ORDER]++
        })
      } else {
        counts[OrderType.NORMAL]++
      }
    })
    const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const pct = (key: string) => Math.round((counts[key] / totalOrders) * 100)
    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint' as const,
        trend: { label: 'of total', value: pct(OrderType.NORMAL), isPositive: true }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary' as const,
        trend: { label: 'of total', value: pct(OrderType.MANUFACTURING), isPositive: true }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger' as const,
        trend: { label: 'of total', value: pct(OrderType.RETURN), isPositive: false }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info' as const,
        trend: { label: 'of total', value: pct(OrderType.PRE_ORDER), isPositive: true }
      }
    ]
  }, [invoiceList])

  const handleStatusChange = (status: string) => {
    setSearchParams((prev) => {
      if (status === 'All') prev.delete('status')
      else prev.set('status', status)
      return prev
    })
    setPage(1)
  }

  const handleOrderTypeChange = (type: string) => {
    setSearchParams((prev) => {
      if (type === 'All') prev.delete('orderType')
      else prev.set('orderType', type)
      return prev
    })
    setPage(1)
    setIsFilterOpen(false)
  }

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams())
    setPage(1)
  }

  const { data: statusCounts } = useQuery({
    queryKey: ['sales', 'status-counts'],
    queryFn: async () => {
      const tabs = [InvoiceStatus.DEPOSITED, 'APPROVED_OR_REJECTED', InvoiceStatus.REFUNDED]
      const counts: Record<string, number> = {}
      await Promise.all(
        tabs.map(async (tab) => {
          let apiStatus: string | undefined = undefined
          let apiStatuses: string | undefined = undefined

          if (tab === 'APPROVED_OR_REJECTED') {
            apiStatuses = [
              InvoiceStatus.APPROVED,
              InvoiceStatus.ONBOARD,
              InvoiceStatus.READY_TO_SHIP,
              InvoiceStatus.DELIVERING,
              InvoiceStatus.DELIVERED,
              InvoiceStatus.COMPLETED,
              InvoiceStatus.REJECTED,
              InvoiceStatus.CANCELED
            ].join(',')
          } else if (tab === InvoiceStatus.REFUNDED) {
            // If backend doesn't support REFUNDED yet, pass an empty list or specific status
            apiStatus = InvoiceStatus.REFUNDED
          } else {
            apiStatus = tab as string
          }

          const res = await salesService.getDepositedInvoices(1, 1, apiStatus, apiStatuses)
          counts[tab] = res.data.pagination.total
        })
      )
      return counts
    },
    staleTime: 30000
  })

  const statusTabs = useMemo(() => {
    const allTabs = [
      { label: 'All Invoices', value: 'All' },
      { label: 'Pending', value: InvoiceStatus.DEPOSITED },
      { label: 'Approved', value: 'APPROVED_OR_REJECTED' },
      { label: 'Refunded', value: InvoiceStatus.REFUNDED }
    ]
    return allTabs.filter((tab) => {
      if (tab.value === 'All') return true
      return (statusCounts?.[tab.value] ?? 0) > 0
    })
  }, [statusCounts])

  const getStatusBadgeProps = (invoice: Invoice) => {
    const s = invoice.status
    const hasMfg = invoice.orders?.some((o) =>
      (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
        String(t).includes(OrderType.MANUFACTURING)
      )
    )

    if (statusFilter === 'APPROVED_OR_REJECTED') {
      if (s === InvoiceStatus.REJECTED || s === 'REJECTED' || s === InvoiceStatus.CANCELED) {
        return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
      }
      if (
        [
          InvoiceStatus.APPROVED,
          InvoiceStatus.ONBOARD,
          InvoiceStatus.READY_TO_SHIP,
          InvoiceStatus.DELIVERING,
          InvoiceStatus.DELIVERED,
          InvoiceStatus.COMPLETED
        ].includes(s as InvoiceStatus)
      ) {
        return { label: 'Accepted', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
      }
    }

    if (s === InvoiceStatus.DEPOSITED) {
      if (
        invoice.hasManufacturing &&
        invoice.totalOrdersCount &&
        invoice.approvedOrdersCount === invoice.totalOrdersCount
      ) {
        return {
          label: 'Ready to Approve Final',
          color: 'bg-mint-50 text-mint-600 border-mint-200'
        }
      }
      return hasMfg
        ? { label: 'Wait Verify', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
        : { label: 'Pending', color: 'bg-slate-50 text-slate-500 border-slate-200' }
    }

    if (s === InvoiceStatus.APPROVED || s === 'APPROVED')
      return { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    if (s === InvoiceStatus.REJECTED || s === 'REJECTED')
      return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    if (s === InvoiceStatus.REFUNDED || s === 'REFUNDED')
      return { label: 'Refunded', color: 'bg-purple-50 text-purple-600 border-purple-100' }

    return { label: String(s) || 'Unknown', color: 'bg-slate-50 text-slate-400 border-slate-100' }
  }

  const handleApproveClick = (invoiceId: string) => {
    setInvoiceToProcess(invoiceId)
    setShowConfirmModal(true)
  }

  const confirmApproval = async () => {
    if (invoiceToProcess) {
      await approveInvoice(invoiceToProcess)
      refetch()
      setShowConfirmModal(false)
      setInvoiceToProcess(null)
    }
  }

  const confirmRejection = async (note: string) => {
    if (invoiceToProcess) {
      await rejectInvoice(invoiceToProcess, note)
      refetch()
      setShowRejectModal(false)
      setInvoiceToProcess(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Orders' }]}
        subtitle="Consolidated view of all sales orders, pre-orders, and returns."
      />
      <div className="space-y-6">
        <OrderMetrics
          metrics={metrics}
          orderTypeFilter={orderTypeFilter}
          onOrderTypeChange={handleOrderTypeChange}
        />
        <StatusFilterBar
          statusTabs={statusTabs}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          onReset={handleResetFilters}
          orderTypeFilter={orderTypeFilter}
        />
        <div className="bg-white border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 rounded-[32px] overflow-hidden">
          <OrderTable
            invoices={paginatedInvoices}
            selectedInvoiceId={selectedInvoiceId}
            setSelectedInvoiceId={setSelectedInvoiceId}
            getStatusBadgeProps={getStatusBadgeProps}
            handleApproveClick={handleApproveClick}
            processing={processing}
          />
          {(serverTotal > 0 || filteredInvoices.length > 0) && (
            <OrderPagination
              page={page}
              totalPages={adjustedTotalPages}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <InvoiceOrdersDrawer
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmApproval}
        title="Approve Invoice"
        message="Are you sure you want to approve this invoice? All orders within this invoice will be marked as verified and proceed to the next stage."
        confirmText="Approve Invoice"
        type="info"
        isLoading={processing}
      />
      <RejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmRejection}
        isLoading={processing}
      />
    </div>
  )
}
