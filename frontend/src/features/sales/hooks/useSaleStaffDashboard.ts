/**
 * Custom hook for SaleStaff Dashboard page
 * Handles state and logic for dashboard metrics, charts, and order management
 */
import { useState, useCallback } from 'react'

interface UseDashboardReturn {
  SelectedOrderId: string | null
  isDrawerOpen: boolean
  viewFullId: string | null
  openDrawer: (id: string) => void
  closeDrawer: () => void
  viewFullDetails: () => void
  closeFullDetails: () => void
}

export function useDashboard(): UseDashboardReturn {
  const [SelectedOrderId, setSelectedOrderId] = useState<string | null>(null)
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
    if (SelectedOrderId) {
      setViewFullId(SelectedOrderId)
      setIsDrawerOpen(false)
    }
  }, [SelectedOrderId])

  const closeFullDetails = useCallback(() => {
    setViewFullId(null)
    setSelectedOrderId(null)
  }, [])

  return {
    SelectedOrderId,
    isDrawerOpen,
    viewFullId,
    openDrawer,
    closeDrawer,
    viewFullDetails,
    closeFullDetails
  }
}
