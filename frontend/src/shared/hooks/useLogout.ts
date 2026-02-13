import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'

/**
 * useLogout Hook
 * Handles auth clearing and redirection to home page
 */
export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    try {
      logout()
      toast.success('Logged out successfully')
      navigate('/') // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  return { handleLogout }
}
