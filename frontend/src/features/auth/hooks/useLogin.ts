import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'

export const useLogin = (role: 'customer' | 'staff' = 'customer') => {
  const navigate = useNavigate()
  const { setToken, fetchProfile } = useAuthStore()
  const { fetchCart } = useCartStore()
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

      // 2. Store token
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

      if (role === 'staff') {
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
