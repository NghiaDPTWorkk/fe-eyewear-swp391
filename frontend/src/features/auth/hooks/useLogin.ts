import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

export const useLogin = (
  role:
    | 'customer'
    | 'staff'
    | 'admin'
    | 'manager'
    | 'operations'
    | 'SALE_STAFF'
    | 'SALES_STAFF' = 'customer'
) => {
  const navigate = useNavigate()
  const { setToken } = useAuthStore()
  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      if (role !== 'customer') {
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

      // 2. Store token
      localStorage.setItem('accessToken', token)
      localStorage.setItem('access_token', token)
      setToken(token)

      toast.success('Login successful!')

      if (role !== 'customer') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
      console.error('Login failed', error)
    }
  })
}
