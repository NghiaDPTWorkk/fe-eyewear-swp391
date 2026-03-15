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

    const syncAuth = (event: StorageEvent) => {
      if (event.key === 'auth-storage') {
        useAuthStore.persist.rehydrate()
      }
    }

    window.addEventListener('storage', syncAuth)
    return () => window.removeEventListener('storage', syncAuth)
  }, [])

  if (!hasHydrated || isLoading) {
    return <LazyPage children={<div></div>}></LazyPage>
  }

  if (!isAuthenticated) {
    if (!requireAuth) {
      return <>{children}</>
    }
    const isStaffPath =
      location.pathname.startsWith('/sale-staff') ||
      location.pathname.startsWith('/operation-staff') ||
      location.pathname.startsWith('/manager') ||
      location.pathname.startsWith('/admin')

    return (
      <Navigate to={isStaffPath ? '/admin/login' : '/login'} state={{ from: location }} replace />
    )
  }

  const isStaffRole = ['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER'].includes(role || '')
  const isPublicPath = !allowedRoles || allowedRoles.length === 0

  if (isStaffRole && (isPublicPath || (allowedRoles && !allowedRoles.includes(role || '')))) {
    if (role === 'SALE_STAFF' && !location.pathname.startsWith('/sale-staff')) {
      return <Navigate to="/sale-staff/dashboard" replace />
    }
    if (role === 'OPERATION_STAFF' && !location.pathname.startsWith('/operation-staff')) {
      return <Navigate to="/operation-staff/dashboard" replace />
    }
    if (role === 'MANAGER' && !location.pathname.startsWith('/manager')) {
      return <Navigate to="/manager/dashboard" replace />
    }
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
