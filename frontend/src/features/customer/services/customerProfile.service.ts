import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  BasicSuccessResponse,
  CustomerProfileResponse,
  UpdateCustomerPasswordRequest,
  UpdateCustomerProfileRequest
} from '@/shared/types/customer.types'

export const customerProfileService = {
  /**
   * Get current customer profile
   */
  getProfile: async (): Promise<CustomerProfileResponse> => {
    const response = await apiClient.get(ENDPOINTS.AUTH.PROFILE)
    return response.data
  },

  /**
   * Update current customer profile
   */
  updateProfile: async (payload: UpdateCustomerProfileRequest): Promise<BasicSuccessResponse> => {
    const response = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, payload)
    return response.data
  },

  /**
   * Change customer password
   */
  changePassword: async (payload: UpdateCustomerPasswordRequest): Promise<BasicSuccessResponse> => {
    const response = await apiClient.patch(ENDPOINTS.AUTH.CHANGE_PASSWORD_CUSTOMER, payload)
    return response.data
  }
}
