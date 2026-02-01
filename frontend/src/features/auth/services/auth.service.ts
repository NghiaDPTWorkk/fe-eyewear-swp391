import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types'
import { authApi } from './auth.api.legacy'

export const authService = {
  async login(payload: LoginRequest) {
    // httpClient already unwraps res.data, so response is the actual data
    const response = await authApi.loginCustomer(payload)

    // Extract tokens from response
    const accessToken = (response as any)?.accessToken ?? (response as any)?.token

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }

    return response
  },

  async register(payload: RegisterRequest) {
    const response = await authApi.register(payload)
    return response
  }
}
