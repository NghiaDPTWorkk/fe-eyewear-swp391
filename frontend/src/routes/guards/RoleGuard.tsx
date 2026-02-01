import { useAuthStore } from '@/store'
import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '@/shared/constants/user-role'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const userRole = (user as any)?.role?.toUpperCase()

  if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
    console.warn(`Access denied. User role: ${userRole}, Allowed: ${allowedRoles}`)
    return <Navigate to="/404" replace />
  }

  return <>{children}</>
}
