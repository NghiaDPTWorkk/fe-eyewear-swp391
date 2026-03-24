import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { showError, showSuccess } from '@/features/sales/utils/errorHandler'
import { queryClient } from '@/lib/react-query'

const getRolePath = (role: string): string => {
  const normalizedRole = role.toUpperCase().replace(/\s+/g, '_')
  const rolePathMap: Record<string, string> = {
    CUSTOMER: 'customer',
    SALE_STAFF: 'sale-staff',
    OPERATION_STAFF: 'operation-staff',
    MANAGER: 'manager',
    SYSTEM_ADMIN: 'admin',
    ADMIN: 'admin'
  }
  return rolePathMap[normalizedRole] || 'customer'
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
    mutationFn: async (payload: LoginRequest) => {
      // Clear any existing tokens/cookies of the other role to ensure a clean session
      try {
        if (isStaffLogin()) {
          // If logging into admin, attempt to clear customer session cookies
          await authApi.logout()
        } else {
          // If logging into customer, attempt to clear staff session cookies
          await authApi.logoutStaff()
        }
      } catch (err) {
        // Silently ignore logout errors
        console.debug('Pre-login cleanup skipped or failed:', err)
      }

      // 2. Perform the actual login
      if (isStaffLogin()) {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: async (response: LoginResponse) => {
      // 1. Robust Token Extraction

      const authData = (response as any).data || response

      const token = authData.token || authData.accessToken || (response as any).token

      if (!token) {
        console.error('No token found in response:', response)
        if (isStaffLogin()) {
          showError('Invalid login response: Token missing')
        } else {
          toast.error('Invalid login response: Token missing')
        }
        return
      }

      // 2. Store token (this will automatically extract and set role from JWT)
      localStorage.setItem('access_token', token)
      setToken(token)

      // 3. Clear stale cache and fetch fresh profile (automatically handles Admin vs Customer profile)
      try {
        queryClient.clear()
        await fetchProfile()
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
      }

      // 4. Fetch cart ONLY for customers
      if (!isStaffLogin()) {
        try {
          await fetchCart()
        } catch (error) {
          console.error('Failed to fetch cart after login:', error)
        }
      }

      // Use appropriate success message based on login type
      if (isStaffLogin()) {
        showSuccess('Login successful! Welcome to OpticView Staff Portal')
      } else {
        toast.success('Login successful!')
      }

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
        const rolePath = getRolePath(roleFromToken)
        navigate(`/${rolePath}/dashboard`)
      } else {
        // Fallback: if something went wrong, go to home
        console.error('Unexpected state: roleFromToken and isStaffLogin mismatch')
        navigate('/')
      }
    },
    onError: (error: any) => {
      let errorMessage =
        error?.response?.data?.message || error?.message || 'Login failed. Please try again.'

      // Translate 401 or similar errors to a friendlier message
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 400 ||
        errorMessage.includes('401')
      ) {
        errorMessage = 'Email or password is wrong.'
      }

      // Use Sales Staff error handler for staff login, regular toast for customer login
      if (isStaffLogin()) {
        showError(error, errorMessage)
      } else {
        toast.error(errorMessage)
      }
      console.error('Login failed', error)
    }
  })
}
