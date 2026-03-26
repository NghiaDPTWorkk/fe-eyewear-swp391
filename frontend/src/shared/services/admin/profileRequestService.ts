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
  }
}
