import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

export const useLogin = (role: 'customer' | 'staff' = 'customer') => {
  const navigate = useNavigate()
  const { setToken } = useAuthStore()
  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      if (role === 'staff') {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: async (response: LoginResponse) => {
      console.log('Login Success Response:', response)

      // 1. Robust Token Extraction
      const authData = (response as any).data || response
      const token = authData.token || authData.accessToken || (response as any).token

      if (!token) {
        console.error('No token found in response:', response)
        toast.error('Invalid login response: Token missing')
        return
      }

      // 2. Store token and set state
      localStorage.setItem('access_token', token)
      setToken(token)

      try {
        // 3. Fetch user profile immediately
        const userProfile = await authApi.getProfile()
        const userData = (userProfile as any).data || userProfile

        // 4. Set user data to store
        useAuthStore.getState().setUser(userData)

        toast.success('Login successful!')

        // 5. Navigate based on role from profile
        const userRole = userData.role
        if (userRole === 'SALE_STAFF' || role === 'staff') {
          navigate('/salestaff/dashboard')
        } else if (userRole === 'OPERATION_STAFF') {
          navigate('/operationstaff/dashboard')
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
        toast.error('Logged in but failed to load user profile')
      }
    },

    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
      console.error('Login failed', error)
    }
  })
}
