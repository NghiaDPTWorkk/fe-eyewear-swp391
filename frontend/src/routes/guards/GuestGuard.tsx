import { useAuthStore } from '@/store'
import { Navigate } from 'react-router-dom'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, role } = useAuthStore()

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
