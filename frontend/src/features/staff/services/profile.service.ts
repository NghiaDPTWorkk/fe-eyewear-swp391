import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ProfileApiResponse } from '@/shared/types/admin-account.types'

export const profileService = {
  /**
   * Lấy thông tin profile của admin/staff đang đăng nhập
   * Endpoint: GET /admin/auth/profile
   * Authorization: Bearer {accessToken}
   */
  getProfile: async () => {
    return httpClient.get<ProfileApiResponse>(ENDPOINTS.AUTH.GET_PROFILE)
  }
}
