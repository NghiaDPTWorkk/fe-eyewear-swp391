/**
 * Custom hook for SaleStaff Returns management
 * Handles return Selection and detail view
 */
import { useState, useCallback } from 'react'

interface UseReturnsReturn {
  SelectedReturnId: string | null
  SelectReturn: (id: string) => void
  clearSelection: () => void
}

export function useReturns(): UseReturnsReturn {
  const [SelectedReturnId, setSelectedReturnId] = useState<string | null>(null)

  const SelectReturn = useCallback((id: string) => {
    setSelectedReturnId(id)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedReturnId(null)
  }, [])

  return {
    SelectedReturnId,
    SelectReturn,
    clearSelection
  }
}
