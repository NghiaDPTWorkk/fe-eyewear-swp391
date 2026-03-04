import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { LazyPage } from '@/pages/LazyPage'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, role, isLoading } = useAuthStore()
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)

    // Sync auth state across tabs
    const syncAuth = (event: StorageEvent) => {
      if (event.key === 'auth-storage') {
        useAuthStore.persist.rehydrate()
      }
    }

    window.addEventListener('storage', syncAuth)
    return () => window.removeEventListener('storage', syncAuth)
  }, [])

  // Wait for zustand to finish hydrating
  if (!hasHydrated || isLoading) {
    return <LazyPage children={<div></div>}></LazyPage>
  }

  if (isAuthenticated) {
    if (role === 'SALE_STAFF') {
      return <Navigate to="/salestaff/dashboard" replace />
    }
    if (role === 'OPERATION_STAFF') {
      return <Navigate to="/operationstaff/dashboard" replace />
    }
    if (role === 'MANAGER') {
      return <Navigate to="/manager/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
