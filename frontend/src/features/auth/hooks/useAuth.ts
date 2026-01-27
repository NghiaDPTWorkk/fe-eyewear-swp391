import { useAuthStore } from '@/store'

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore()

  return {
    user,
    isAuthenticated
  }
}
