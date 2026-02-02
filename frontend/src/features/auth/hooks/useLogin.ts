import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'

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
  const { setToken, fetchProfile } = useAuthStore()
  const { fetchCart } = useCartStore()

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
    onSuccess: async (response: LoginResponse) => {
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

      // 3. Fetch user profile
      try {
        await fetchProfile()
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
        // Continue anyway, profile will be fetched on next page load
      }

      // 4. Fetch cart from backend
      try {
        await fetchCart()
      } catch (error) {
        console.error('Failed to fetch cart after login:', error)
        // Continue anyway, cart will be fetched when user visits cart page
      }

      toast.success('Login successful!')

      // Get role from store (it was automatically extracted from JWT by setToken)
      const roleFromToken = useAuthStore.getState().role

      console.log('Role from token:', roleFromToken)

      // Navigation logic based on role
      // Customer: no role in JWT token and not staff login
      if (!roleFromToken && !isStaffLogin()) {
        // For customers: redirect to previous page or home
        const from = (location.state as any)?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else if (roleFromToken) {
        // For staff: redirect to role-specific dashboard
        const rolePath = getRolePath(
          roleFromToken as 'SALE_STAFF' | 'SYSTEM_ADMIN' | 'MANAGER' | 'OPERATION_STAFF'
        )
        navigate(`/${rolePath}`)
      } else {
        // Fallback: if something went wrong, go to home
        console.error('Unexpected state: roleFromToken and isStaffLogin mismatch')
        navigate('/')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
      console.error('Login failed', error)
    }
  })
}
