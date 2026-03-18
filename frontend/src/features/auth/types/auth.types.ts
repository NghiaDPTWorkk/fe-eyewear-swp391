import type { User } from '@/shared/types'
/**
 * Authentication request and response types
 * Matches backend API structure
 */

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  gender: 'F' | 'M' | 'N'
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  token?: string
  user?: User
}

export interface LoginResponse {
  success: boolean
  message: string
  data: AuthResponse
}

// Keep LoginResponse for backward compatibility and as the full response type
// export type LoginResponse = AuthResponse // Removed this to use the interface above
