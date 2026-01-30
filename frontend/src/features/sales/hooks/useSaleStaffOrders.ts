/**
 * Custom hook for SaleStaff Order management.
 * Handles state, filtering, and actions for standard orders.
 */
import { useState, useCallback } from 'react'

// Types
export interface Order {
  id: string
  customerId: string
  customerName: string
  status: 'pending' | 'processing' | 'packaging' | 'completed'
  total: number
  createdAt: string
  isPrescription: boolean
}

interface UseSaleStaffOrdersReturn {
  // State
  filter: string
  setFilter: (filter: string) => void
  selectedOrderId: string | null
  isDrawerOpen: boolean
  viewFullId: string | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  // Actions
  openDrawer: (id: string) => void
  closeDrawer: () => void
  viewFullDetails: () => void
  closeFullDetails: () => void
  sendToPackaging: (orderId: string) => void
}

export function useSaleStaffOrders(): UseSaleStaffOrdersReturn {
  // UI State
  const [filter, setFilter] = useState('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewFullId, setViewFullId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Open order drawer
  const openDrawer = useCallback((id: string) => {
    setSelectedOrderId(id)
    setIsDrawerOpen(true)
  }, [])

  // Close order drawer
  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // View full order details
  const viewFullDetails = useCallback(() => {
    if (selectedOrderId) {
      setViewFullId(selectedOrderId)
      setIsDrawerOpen(false)
    }
  }, [selectedOrderId])

  // Return to order list
  const closeFullDetails = useCallback(() => {
    setViewFullId(null)
    setSelectedOrderId(null)
  }, [])

  // Send order to packaging department (business logic)
  const sendToPackaging = useCallback((orderId: string) => {
    console.log(`[SaleStaff] Sending order ${orderId} to Packaging Department`)
    // TODO: Integrate with API to update order status
  }, [])

  return {
    filter,
    setFilter,
    selectedOrderId,
    isDrawerOpen,
    viewFullId,
    searchQuery,
    setSearchQuery,
    openDrawer,
    closeDrawer,
    viewFullDetails,
    closeFullDetails,
    sendToPackaging
  }
}
