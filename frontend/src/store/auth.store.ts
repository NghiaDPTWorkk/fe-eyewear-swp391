import type { User } from '@/shared/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/features/auth/services/auth.service'
import { getRoleFromToken } from '@/shared/utils'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  role: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setRole: (role: string | null) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          // Extract role from JWT token
          const role = getRoleFromToken(token)
          console.log('Role from token in setToken:', role)
          set({ accessToken: token, isAuthenticated: true, role })
        } else {
          set({ accessToken: null, isAuthenticated: false, role: null })
        }
      },
      setRole: (role) => set({ role }),
      logout: () => set({ user: null, accessToken: null, isAuthenticated: false, role: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      fetchProfile: async () => {
        if (useAuthStore.getState().isLoading) return

        set({ isLoading: true })
        try {
          const profile = await authService.getProfile()
          set({ user: profile, isAuthenticated: true })
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          // If profile fetch fails, we might want to logout or just handle the error
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
