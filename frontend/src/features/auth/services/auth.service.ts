import { authApi } from '@/api/modules/auth.api'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types'

export const authService = {
  async login(payload: LoginRequest) {
    // httpClient already unwraps res.data, so response is the actual data
    const response = await authApi.loginCustomer(payload)

    // Extract tokens from response
    const { accessToken, refreshToken } = response as any

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }

    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }

    return response
  },

  async register(payload: RegisterRequest) {
    const response = await authApi.register(payload)
    return response
  }
}
