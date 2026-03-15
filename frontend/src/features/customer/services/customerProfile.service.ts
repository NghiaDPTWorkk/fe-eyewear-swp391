import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  BasicSuccessResponse,
  CustomerProfileResponse,
  UpdateCustomerPasswordRequest,
  UpdateCustomerProfileRequest
} from '@/shared/types/customer.types'

export const customerProfileService = {
  getProfile: async (): Promise<CustomerProfileResponse> => {
    const response = await apiClient.get(ENDPOINTS.AUTH.PROFILE)
    return response.data
  },

  updateProfile: async (payload: UpdateCustomerProfileRequest): Promise<BasicSuccessResponse> => {
    const response = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, payload)
    return response.data
  },

  changePassword: async (payload: UpdateCustomerPasswordRequest): Promise<BasicSuccessResponse> => {
    const response = await apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD_CUSTOMER, payload)
    return response.data
  }
}
