import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ChangePasswordRequest,
  GenericApiResponse,
  ProfileApiResponse,
  ProfileUpdateRequest
} from '@/shared/types/admin-account.types'

export const profileService = {
  getProfile: async () => {
    return httpClient.get<ProfileApiResponse>(ENDPOINTS.AUTH.GET_PROFILE)
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return httpClient.patch<GenericApiResponse>(ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  },

  requestProfileUpdate: async (data: ProfileUpdateRequest) => {
    return httpClient.post<GenericApiResponse>(ENDPOINTS.ADMIN.PROFILE_REQUESTS, data)
  }
}
