import { useMutation } from '@tanstack/react-query'
import type { LoginRequest } from '@/shared/types'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { PATHS } from '@/routes/paths'

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
    onSuccess: async (response: any, variables: LoginRequest) => {
      console.log('Login Response:', response)

      const token =
        response.accessToken ||
        response.token ||
        response.data?.accessToken ||
        response.data?.token ||
        response.metadata?.accessToken ||
        response.metadata?.token ||
        (response as any).data?.metadata?.accessToken

      const authData = response.metadata || response.data || response

      if (!token) {
        console.error('Token extraction failed. Response:', response)
        toast.error('Invalid login response: Token missing')
        return
      }

      localStorage.setItem('access_token', token)
      setToken(token)

      try {
        let userData = authData.user || (authData as any).userData || (authData as any).data?.user

        if (!userData || !userData.role) {
          try {
            console.log('Fetching profile fallback for role:', role)
            const userProfile =
              role === 'staff' ? await authApi.getStaffProfile() : await authApi.getProfile()
            userData = (userProfile as any).data || userProfile
          } catch (profileError) {
            console.error('Failed to fetch profile after login:', profileError)
          }
        }

        if (!userData || !userData.role) {
          console.warn('Constructing synthetic user data for navigation (no role assigned)')
          userData = {
            _id: 'temp-id',
            email: variables.email,
            name: 'User',
            role: undefined
          }
        }

        // NOTE: Recursive profile fetching restored to ensure we have the ROLE for redirection.
        if (userData) {
          useAuthStore.getState().setUser(userData)
        }

        toast.success('Login successful!')

        const userRole = (userData?.role || '').toUpperCase()
        console.log('User Role for redirection:', userRole)

        if (userRole === 'SALE_STAFF') {
          navigate(PATHS.SALESTAFF.DASHBOARD)
        } else if (userRole === 'OPERATION_STAFF') {
          navigate(PATHS.OPERATIONSTAFF.DASHBOARD)
        } else if (userRole === 'ADMIN' || userRole === 'MANAGER') {
          navigate(PATHS.ADMIN.DASHBOARD)
        } else if (role === 'staff') {
          navigate(PATHS.SALESTAFF.DASHBOARD)
        } else {
          navigate(PATHS.HOME)
        }
      } catch (error) {
        console.error('Login post-processing error:', error)
        toast.error('Login processed with warnings')
        if (role === 'staff') navigate(PATHS.SALESTAFF.DASHBOARD)
        else navigate(PATHS.HOME)
      }
    },

    onError: (error: any) => {
      toast.error(error.message || 'Login failed. Please try again.')
      console.error('Login failed', error)
    }
  })
}
