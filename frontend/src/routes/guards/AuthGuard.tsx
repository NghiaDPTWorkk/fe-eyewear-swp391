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
    const isStaffRoute =
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/operationstaff') ||
      location.pathname.startsWith('/salestaff') ||
      location.pathname.startsWith('/manager')

    const redirectPath = isStaffRoute ? '/admin/login' : '/login'
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <>{children}</>
}
