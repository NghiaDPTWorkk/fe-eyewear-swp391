import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ChangePasswordRequest,
  GenericApiResponse,
  ProfileApiResponse
} from '@/shared/types/admin-account.types'

export const profileService = {
  /**
   * Lấy thông tin profile của admin/staff đang đăng nhập
   * Endpoint: GET /admin/auth/profile
   * Authorization: Bearer {accessToken}
   */
  getProfile: async () => {
    return httpClient.get<ProfileApiResponse>(ENDPOINTS.AUTH.GET_PROFILE)
  },

  /**
   * Thay đổi mật khẩu của admin/staff đang đăng nhập
   * Endpoint: POST /admin/auth/profile/change-password
   */
  changePassword: async (data: ChangePasswordRequest) => {
    return httpClient.post<GenericApiResponse>(ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  }
}
