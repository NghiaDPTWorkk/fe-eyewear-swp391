import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { queryClient } from '@/lib/react-query'
import toast from 'react-hot-toast'

export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    try {
      queryClient.clear()

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
