import type { User, AdminAccount } from '@/shared/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '@/features/auth/services/auth.service'
import { getRoleFromToken, isTokenExpired } from '@/shared/utils'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { apiClient } from '@/lib/axios'

const ADMIN_ROLES = ['SYSTEM_ADMIN', 'SALE_STAFF', 'MANAGER', 'OPERATION_STAFF']

export interface AuthState {
  user: User | AdminAccount | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: any | null
  role: string | null
  _hasHydrated: boolean
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
      _hasHydrated: false,

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
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          useAuthStore.setState({ _hasHydrated: true })
          return
        }

        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

        if (!accessToken) {
          useAuthStore.setState({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            role: null,
            _hasHydrated: true
          })
          return
        }

        if (isTokenExpired(accessToken)) {
          // Lấy role đã persist để chọn đúng endpoint
          const persistedRole = state?.role
          const refreshEndpoint =
            persistedRole && ADMIN_ROLES.includes(persistedRole.toUpperCase())
              ? '/admin/auth/refresh-token'
              : '/auth/refresh-token'

          apiClient
            .post<{ data?: { accessToken: string }; accessToken?: string }>(
              refreshEndpoint,
              undefined,
              { skipAuth: true, _retry: true, withCredentials: true }
            )
            .then((res: any) => {
              const newToken = res?.data?.data?.accessToken || res?.data?.accessToken
              if (newToken) {
                localStorage.setItem('access_token', newToken)
                useAuthStore.getState().setToken(newToken)
              } else {
                useAuthStore.getState().logout()
              }
            })
            .catch(() => {
              useAuthStore.getState().logout()
            })
            .finally(() => {
              useAuthStore.setState({ _hasHydrated: true })
            })
          return
        }

        useAuthStore.setState({ _hasHydrated: true })
      }
    }
  )
)
