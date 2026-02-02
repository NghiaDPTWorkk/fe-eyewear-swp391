import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

// Helper function to map roles to their corresponding paths
const getRolePath = (
  role: 'customer' | 'SALE_STAFF' | 'SYSTEM_ADMIN' | 'MANAGER' | 'OPERATION_STAFF'
): string => {
  const rolePathMap: Record<string, string> = {
    customer: 'customer',
    SALE_STAFF: 'salestaff',
    OPERATION_STAFF: 'operation',
    MANAGER: 'manager',
    SYSTEM_ADMIN: 'admin'
  }
  return rolePathMap[role] || 'customer'
}

export const useLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useAuthStore()

  // Determine if this is a staff login based on current URL path
  // If path includes '/admin/', use staff login, otherwise use customer login
  const isStaffLogin = () => {
    return location.pathname.toLowerCase().includes('/admin/')
  }
  // console.log('isStaffLogin:', isStaffLogin())

  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      // Use staff login API if URL contains '/admin/'
      if (isStaffLogin()) {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: (response: LoginResponse) => {
      console.log('Login Success Response:', response)

      // 1. Robust Token Extraction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const authData = (response as any).data || response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = authData.token || authData.accessToken || (response as any).token

      if (!token) {
        console.error('No token found in response:', response)
        toast.error('Invalid login response: Token missing')
        return
      }

      // 2. Store token (this will automatically extract and set role from JWT)
      localStorage.setItem('accessToken', token)
      localStorage.setItem('access_token', token)
      setToken(token)

      toast.success('Login successful!')

      // Get role from store (it was automatically extracted from JWT by setToken)
      const roleFromToken = useAuthStore.getState().role

      if (!roleFromToken) {
        console.error('Role not found in JWT token')
        toast.error('Invalid token: Role missing')
        return
      }

      console.log('Role from token:', roleFromToken)
      // Redirect based on role
      const rolePath = getRolePath(
        roleFromToken as 'customer' | 'SALE_STAFF' | 'SYSTEM_ADMIN' | 'MANAGER' | 'OPERATION_STAFF'
      )
      navigate(`/${rolePath}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
      console.error('Login failed', error)
    }
  })
}
