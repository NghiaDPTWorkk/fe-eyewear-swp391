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
  token?: string
  accessToken: string
  refreshToken?: string
  user: {
    _id: string
    name: string
    email: string
    phone: string
    gender: 'F' | 'M' | 'N'
  }
}

// Alias for backward compatibility
export type LoginResponse = AuthResponse
