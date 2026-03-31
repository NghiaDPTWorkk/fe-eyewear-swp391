import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { useAuthStore } from '@/store/auth.store'
import { toast } from 'react-hot-toast'

export const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setToken, fetchProfile } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')

    if (accessToken) {
      const handleLoginSuccess = async () => {
        try {
          // 1. Set token in store and localStorage (setToken now handles localStorage too)
          setToken(accessToken)
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
          localStorage.setItem('accessToken', accessToken)

          // 2. Fetch user profile
          await fetchProfile()

          toast.success('Login successful!')

          // Redirect to home or intended page
          const redirectTo = localStorage.getItem('redirect_after_login') || '/'
          localStorage.removeItem('redirect_after_login')
          navigate(redirectTo)
        } catch (error) {
          console.error('Login failed:', error)
          toast.error('Failed to complete login. Please try again.')
          navigate('/login')
        }
      }

      handleLoginSuccess()
    } else {
      const error = searchParams.get('error')
      if (error) {
        toast.error(`Login failed: ${error}`)
      } else {
        toast.error('No access token found.')
      }
      navigate('/login')
    }
  }, [searchParams, navigate, setToken, fetchProfile])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <h2 className="text-xl font-semibold text-gray-900">Completing login...</h2>
        <p className="text-gray-500">Please wait while we authenticate you.</p>
      </div>
    </div>
  )
}
