import type { User, AdminAccount } from '@/shared/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/features/auth/services/auth.service'
import { getRoleFromToken } from '@/shared/utils'

import { useCartStore } from './cart.store'
import { useWishlistStore } from './wishlist.store'

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
  updateProfile: (payload: { name: string; phone: string; gender: string }) => Promise<void>
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
          // Extract role from JWT token, fallback to existing role if not present in new token
          // (e.g. some backends don't encode role in refresh-token response)
          const roleFromJwt = getRoleFromToken(token)
          const existingRole = useAuthStore.getState().role
          const role = roleFromJwt || existingRole
          set({ accessToken: token, isAuthenticated: true, role })
        } else {
          set({ accessToken: null, isAuthenticated: false, role: null })
        }
      },
      setRole: (role) => set({ role }),
      logout: () => {
        // Clear ALL known token keys from localStorage to prevent stale tokens
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('access_token')
        set({ user: null, accessToken: null, isAuthenticated: false, role: null, error: null })
        // Reset cart and wishlist immediately so the header count and status clear without a page reload
        useCartStore.setState({ items: [], isInitialized: false })
        useWishlistStore.setState({ items: [], isInitialized: false })
      },
      setLoading: (loading) => set({ isLoading: loading }),
      fetchProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const role = useAuthStore.getState().role
          const profile = await authService.getProfile(role)
          set({ user: profile, isAuthenticated: true })
        } catch (error) {
          console.error('Failed to fetch profile:', error)
          set({ error: error as any })
        } finally {
          set({ isLoading: false })
        }
      },
      updateProfile: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const updatedUser = await authService.updateProfile(payload)
          set({ user: updatedUser })
        } catch (error) {
          console.error('Failed to update profile:', error)
          set({ error: error as any })
          throw error
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // No longer partialize _hasHydrated since it is removed from state
      onRehydrateStorage: () => (state) => {
        // neu co token ma khong co user (do refresh), goi fetchProfile lai
        if (state?.accessToken && !state.user) {
          useAuthStore
            .getState()
            .fetchProfile()
            .catch((err) => {
              console.error('[Auth] Initial profile fetch failed:', err)
            })
        }
      }
    }
  )
)
