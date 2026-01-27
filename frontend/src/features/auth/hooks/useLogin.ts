import { authApi } from '@/api/modules/auth.api'
import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate } from 'react-router-dom'

export const useLogin = (role: 'customer' | 'staff' = 'customer') => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      if (role === 'staff') {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: (response: LoginResponse) => {
      const { accessToken } = response.data
      localStorage.setItem('accessToken', accessToken)

      if (role === 'staff') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    },
    onError: (error: any) => {
      console.error('Login failed', error)
    }
  })
}
