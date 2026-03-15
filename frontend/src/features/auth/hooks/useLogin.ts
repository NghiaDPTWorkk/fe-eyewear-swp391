import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { showError, showSuccess } from '@/features/sale-staff/utils/errorHandler'
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

  const isStaffLogin = () => {
    return location.pathname.toLowerCase().includes('/admin/')
  }

  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      if (isStaffLogin()) {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: async (response: LoginResponse) => {
      console.log('Login Success Response:', response)

      console.group('[LOGIN] Login successful')
      console.info('document.cookie:', document.cookie || '(empty - cookie may be HttpOnly)')
      console.info('deviceId used:', localStorage.getItem('x_device_id'))
      console.groupEnd()

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

      localStorage.setItem('access_token', token)
      setToken(token)

      try {
        queryClient.clear()
        await fetchProfile()
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
      }

      if (!isStaffLogin()) {
        try {
          await fetchCart()
        } catch (error) {
          console.error('Failed to fetch cart after login:', error)
        }
      }

      if (isStaffLogin()) {
        showSuccess('Login successful! Welcome to OpticView Staff Portal')
      } else {
        toast.success('Login successful!')
      }

      const roleFromToken = useAuthStore.getState().role

      console.log('Role from token:', roleFromToken)

      if (!roleFromToken && !isStaffLogin()) {
        const from = (location.state as any)?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else if (roleFromToken) {
        const rolePath = getRolePath(roleFromToken)
        navigate(`/${rolePath}/dashboard`)
      } else {
        console.error('Unexpected state: roleFromToken and isStaffLogin mismatch')
        navigate('/')
      }
    },
    onError: (error: any) => {
      if (isStaffLogin()) {
        showError(error, 'Login failed. Please check your credentials and try again.')
      } else {
        toast.error(error.message || 'Login failed. Please try again.')
      }
      console.error('Login failed', error)
    }
  })
}
