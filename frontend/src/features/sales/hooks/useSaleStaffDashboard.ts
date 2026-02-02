/**
 * Custom hook for SaleStaff Dashboard page
 * Handles state and logic for dashboard metrics, charts, and order management
 */
import { useState, useCallback } from 'react'

interface UseDashboardReturn {
  selectedOrderId: string | null
  isDrawerOpen: boolean
  viewFullId: string | null
  openDrawer: (id: string) => void
  closeDrawer: () => void
  viewFullDetails: () => void
  closeFullDetails: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewFullId, setViewFullId] = useState<string | null>(null)

  const openDrawer = useCallback((id: string) => {
    setSelectedOrderId(id)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  const viewFullDetails = useCallback(() => {
    if (selectedOrderId) {
      setViewFullId(selectedOrderId)
      setIsDrawerOpen(false)
    }
  }, [selectedOrderId])

  const closeFullDetails = useCallback(() => {
    setViewFullId(null)
    setSelectedOrderId(null)
  }, [])

  return {
    selectedOrderId,
    isDrawerOpen,
    viewFullId,
    openDrawer,
    closeDrawer,
    viewFullDetails,
    closeFullDetails
  }
}
