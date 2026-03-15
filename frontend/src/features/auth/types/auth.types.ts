import type { User } from '@/shared/types'

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
