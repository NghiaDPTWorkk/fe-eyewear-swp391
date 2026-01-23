import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth.service' // Nhớ import đúng path
import { useAuthStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import type { LoginRequest, LoginResponse } from '@/shared/types'
// Import toast library của bạn (ví dụ react-toastify, sonner...)
// import { toast } from 'sonner'

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),

    onSuccess: (response: LoginResponse) => {
      if (response.success && response.data) {
        const { user } = response.data

        if (user) {
          setUser(user)
        }
        console.log(user)

        // toast.success('Đăng nhập thành công')
        navigate('/')
      } else {
        // toast.error(response.message || 'Đăng nhập thất bại')
      }
    },

    onError: (error: any) => {
      console.error('Login failed', error)
    }
  })
}
