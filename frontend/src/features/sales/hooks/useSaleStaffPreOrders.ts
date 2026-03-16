import { useState, useCallback } from 'react'

export interface PreOrder {
  id: string
  sku: string
  productName: string
  customerName: string
  deposit: number
  etaDate: string
  status: 'on_order' | 'delayed' | 'arrived' | 'cancelled'
}

interface UseSaleStaffPreOrdersReturn {
  selectedOrderId: string | null
  isDrawerOpen: boolean
  showFullDetails: boolean
  isCreateModalOpen: boolean

  openDrawer: (id: string) => void
  closeDrawer: () => void
  viewFullDetails: () => void
  backToTable: () => void
  openCreateModal: () => void
  closeCreateModal: () => void
  createOrderRequest: (preOrderId: string) => void
}

export function useSaleStaffPreOrders(): UseSaleStaffPreOrdersReturn {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const openDrawer = useCallback((orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  const viewFullDetails = useCallback(() => {
    setIsDrawerOpen(false)
    setShowFullDetails(true)
  }, [])

  const backToTable = useCallback(() => {
    setShowFullDetails(false)
    setSelectedOrderId(null)
  }, [])

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  const createOrderRequest = useCallback((preOrderId: string) => {
    console.warn(`[SaleStaff] Creating order request for pre-order: ${preOrderId}`)
    console.warn('[SaleStaff] Handing over to Packaging Department')

    setIsCreateModalOpen(false)
  }, [])

  return {
    selectedOrderId,
    isDrawerOpen,
    showFullDetails,
    isCreateModalOpen,
    openDrawer,
    closeDrawer,
    viewFullDetails,
    backToTable,
    openCreateModal,
    closeCreateModal,
    createOrderRequest
  }
}
