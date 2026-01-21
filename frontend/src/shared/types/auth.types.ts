import type { User } from './user.types'

export interface LoginRequest {
  email: string
  password?: string
  googleId?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RegisterRequest {
  email: string
  password?: string
  fullName: string
  phone?: string
  googleId?: string
  avatar?: string
}

export interface RegisterResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}
