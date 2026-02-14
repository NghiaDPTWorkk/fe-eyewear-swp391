import { LazyPage } from '@/pages/LazyPage'
import { useAuthStore } from '@/store'
import { Navigate, useLocation } from 'react-router-dom'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <LazyPage children={<div></div>}></LazyPage>
  }

  if (!isAuthenticated) {
    const isStaffPath =
      location.pathname.startsWith('/salestaff') ||
      location.pathname.startsWith('/operationstaff') ||
      location.pathname.startsWith('/manager') ||
      location.pathname.startsWith('/admin')

    return (
      <Navigate to={isStaffPath ? '/admin/login' : '/login'} state={{ from: location }} replace />
    )
  }

  return <>{children}</>
}
