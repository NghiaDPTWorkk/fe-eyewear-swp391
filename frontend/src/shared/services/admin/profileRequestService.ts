import { ENDPOINTS, httpClient } from '@/api'
import type {
  ProfileRequestListResponse,
  ProfileRequestDetailResponse
} from '@/shared/types'

export const profileRequestService = {
  getProfileRequests(page: number = 1, limit: number = 10) {
    return httpClient.get<ProfileRequestListResponse>(
      ENDPOINTS.ADMIN.PROFILE_REQUESTS.LIST(page, limit)
    )
  },

  getProfileRequestDetail(id: string) {
    return httpClient.get<ProfileRequestDetailResponse>(
      ENDPOINTS.ADMIN.PROFILE_REQUESTS.DETAIL(id)
    )
  },

  approveRequest(id: string) {
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.PROFILE_REQUESTS.APPROVE(id)
    )
  },

  rejectRequest(id: string) {
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.PROFILE_REQUESTS.REJECT(id)
    )
  },

  cancelRequest(id: string) {
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.ADMIN.PROFILE_REQUESTS.CANCEL(id)
    )
  }
}
