import { httpClient } from '../httpClient'
import { ENDPOINTS } from '../endpoints'

import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/shared/types'

export const authApi = {
  login(payload: LoginRequest) {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, payload)
  },

  register(payload: RegisterRequest) {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload)
  },

  getProfile() {
    return httpClient.get<User>(ENDPOINTS.AUTH.PROFILE)
  },

  refreshToken(payload: { refreshToken: string }) {
    return httpClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, payload)
  },

  logout() {
    return httpClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}
