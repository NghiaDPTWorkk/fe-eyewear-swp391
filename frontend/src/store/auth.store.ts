import type { User } from '@/shared/types'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ accessToken: token }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading })
}))
