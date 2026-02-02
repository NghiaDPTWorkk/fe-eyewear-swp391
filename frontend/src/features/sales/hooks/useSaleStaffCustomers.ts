/**
 * Custom hook for SaleStaff Customer management
 * Handles customer Selection and drawer state
 */
import { useState, useCallback } from 'react'

interface Customer {
  name: string
  activity: string
  badge: string
  badgeColor: string
  phone: string
  email: string
  website: string
  avatar: string
}

interface UseCustomersReturn {
  SelectedCustomer: Customer | null
  isDrawerOpen: boolean
  SelectCustomer: (customer: Customer) => void
  closeDrawer: () => void
}

export function useCustomers(): UseCustomersReturn {
  const [SelectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const SelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  return {
    SelectedCustomer,
    isDrawerOpen,
    SelectCustomer,
    closeDrawer
  }
}
