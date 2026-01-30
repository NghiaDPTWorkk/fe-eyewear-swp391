import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import { useNavigate } from 'react-router-dom'
import type { RegisterRequest } from '@/shared/types'

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),

    onSuccess: () => {
      navigate('/login')
    }
  })
}
