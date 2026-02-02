/**
 * Custom hook for SaleStaff Pre-Order management.
 * Handles state, filtering, and the "Create Order Request" action.
 */
import { useState, useCallback } from 'react'

// Types
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
  // State
  SelectedOrderId: string | null
  isDrawerOpen: boolean
  showFullDetails: boolean
  isCreateModalOpen: boolean
  // Actions
  openDrawer: (id: string) => void
  closeDrawer: () => void
  viewFullDetails: () => void
  backToTable: () => void
  openCreateModal: () => void
  closeCreateModal: () => void
  createOrderRequest: (preOrderId: string) => void
}

export function useSaleStaffPreOrders(): UseSaleStaffPreOrdersReturn {
  // UI State
  const [SelectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Open order drawer
  const openDrawer = useCallback((orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDrawerOpen(true)
  }, [])

  // Close drawer
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // View full details
  const viewFullDetails = useCallback(() => {
    setIsDrawerOpen(false)
    setShowFullDetails(true)
  }, [])

  // Back to table view
  const backToTable = useCallback(() => {
    setShowFullDetails(false)
    setSelectedOrderId(null)
  }, [])

  // Open create order modal
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true)
  }, [])

  // Close create order modal
  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false)
  }, [])

  // Create order request from pre-order (hands over to Packaging)
  const createOrderRequest = useCallback((preOrderId: string) => {
    console.log(`[SaleStaff] Creating order request for pre-order: ${preOrderId}`)
    console.log('[SaleStaff] Handing over to Packaging Department')
    // TODO: Integrate with API
    setIsCreateModalOpen(false)
  }, [])

  return {
    SelectedOrderId,
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
