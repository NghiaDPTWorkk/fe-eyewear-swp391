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
  selectedCustomer: Customer | null
  isDrawerOpen: boolean
  selectCustomer: (customer: Customer) => void
  closeDrawer: () => void
}

export function useCustomers(): UseCustomersReturn {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const selectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  return {
    selectedCustomer,
    isDrawerOpen,
    selectCustomer,
    closeDrawer
  }
}
