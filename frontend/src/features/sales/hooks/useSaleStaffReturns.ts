/**
 * Custom hook for SaleStaff Returns management
 * Handles return selection and detail view
 */
import { useState, useCallback } from 'react'

interface UseReturnsReturn {
  selectedReturnId: string | null
  selectReturn: (id: string) => void
  clearSelection: () => void
}

export function useReturns(): UseReturnsReturn {
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  const selectReturn = useCallback((id: string) => {
    setSelectedReturnId(id)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedReturnId(null)
  }, [])

  return {
    selectedReturnId,
    selectReturn,
    clearSelection
  }
}
