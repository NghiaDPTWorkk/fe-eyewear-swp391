import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { queryClient } from '@/lib/react-query'
import toast from 'react-hot-toast'
import { authApi } from '@/features/auth/services/auth.api.legacy'

/**
 * useLogout Hook
 * Handles auth clearing and redirection to home page
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    try {
      // 1. Clear ALL cached query data immediately (sync) to prevent stale profile leaking
      queryClient.clear()

      // 2. Clear backend session to remove cookies
      try {
        await authApi.logoutStaff()
      } catch (e) {
        console.error('API Logout failed:', e)
      }

      // 3. Clear auth state + all localStorage tokens
      logout()
      toast.success('Logged out successfully')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  return { handleLogout }
}
