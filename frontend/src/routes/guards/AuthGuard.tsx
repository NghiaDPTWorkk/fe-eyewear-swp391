import { LazyPage } from '@/pages/LazyPage'
import { useAuthStore } from '@/store'
import { Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requireAuth?: boolean
}

export function AuthGuard({ children, allowedRoles, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading, role } = useAuthStore()
  const location = useLocation()

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

  // wait for zustand to finish hydrating
  if (!hasHydrated || isLoading) {
    return <LazyPage children={<div></div>}></LazyPage>
  }

  if (!isAuthenticated) {
    if (!requireAuth) {
      return <>{children}</>
    }
    const isStaffPath =
      location.pathname.startsWith('/salestaff') ||
      location.pathname.startsWith('/operationstaff') ||
      location.pathname.startsWith('/manager') ||
      location.pathname.startsWith('/admin')

    return (
      <Navigate to={isStaffPath ? '/admin/login' : '/login'} state={{ from: location }} replace />
    )
  }

  // If authenticated, check if role is allowed or if it's a staff role trying to access public pages
  const isStaffRole = ['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER'].includes(role || '')
  const isPublicPath = !allowedRoles || allowedRoles.length === 0

  if (isStaffRole && (isPublicPath || (allowedRoles && !allowedRoles.includes(role || '')))) {
    // Redirect to appropriate dashboard based on role
    if (role === 'SALE_STAFF' && !location.pathname.startsWith('/salestaff')) {
      return <Navigate to="/salestaff/dashboard" replace />
    }
    if (role === 'OPERATION_STAFF' && !location.pathname.startsWith('/operationstaff')) {
      return <Navigate to="/operationstaff/dashboard" replace />
    }
    if (role === 'MANAGER' && !location.pathname.startsWith('/manager')) {
      return <Navigate to="/manager/dashboard" replace />
    }
  }

  // Check if role is allowed (for restricted paths)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Default for customer or other roles
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
