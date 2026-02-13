import type { User, AdminAccount } from '@/shared/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/features/auth/services/auth.service'
import { getRoleFromToken } from '@/shared/utils'

export interface AuthState {
  user: User | AdminAccount | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: any | null
  role: string | null
  setUser: (user: User | AdminAccount | null) => void
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
      error: null,
      role: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          // Extract role from JWT token
          const role = getRoleFromToken(token)
          set({ accessToken: token, isAuthenticated: true, role })
        } else {
          set({ accessToken: null, isAuthenticated: false, role: null })
        }
      },
      setRole: (role) => set({ role }),
      logout: () => {
        localStorage.removeItem('auth-storage') // Clear persist storage
        set({ user: null, accessToken: null, isAuthenticated: false, role: null, error: null })
      },
      setLoading: (loading) => set({ isLoading: loading }),
      fetchProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const profile = await authService.getProfile()
          set({ user: profile, isAuthenticated: true })
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          set({ error: error as any })
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
