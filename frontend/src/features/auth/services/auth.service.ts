import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types'
import { authApi } from './auth.api.legacy'

export const authService = {
  /**
   * Đăng nhập cho khách hàng
   * @param payload - Thông tin đăng nhập
   * @returns Thông tin đăng nhập và tokens
   */
  login: async (payload: LoginRequest) => {
    const response = await authApi.loginCustomer(payload)

    const { accessToken, refreshToken } = response.data

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }

    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }

    return response
  },

  /**
   * Đăng ký tài khoản mới
   * @param payload - Thông tin đăng ký
   * @returns Thông tin tài khoản mới
   */
  register: async (payload: RegisterRequest) => {
    const response = await authApi.register(payload)
    return response
  },

  getProfile: async () => {
    const response = await authApi.getProfile()
    return response.data
  }
}
