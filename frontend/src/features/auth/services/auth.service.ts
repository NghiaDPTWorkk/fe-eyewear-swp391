import { authApi } from '@/api/modules/auth.api'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest } from '@/shared/types'

export const authService = {
  async login(payload: LoginRequest) {
    // response lúc này có kiểu là LoginResponse (ApiResponse<...>)
    const response = await authApi.login(payload)

    // Kiểm tra success (tùy chọn, vì thường lỗi axios đã catch rồi)
    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data // 👈 Phải chọc vào .data

      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      }

      if (refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
    }

    return response
  }
}
