import { ENDPOINTS } from '@/api/endpoints'
import { httpClient } from '@/api/apiClients'
import type { AdminCustomerParams, AdminCustomerListResponse, Customer, UpdateCustomerRequest } from '@/shared/types/customer.types'

export const customerService = {
  getCustomers: (params?: AdminCustomerParams): Promise<AdminCustomerListResponse> => {
    return httpClient.get(
      ENDPOINTS.ADMIN.CUSTOMERS_LIST(params?.page, params?.limit, params?.search, params?.status)
    )
  },

  getCustomerById: async (id: string): Promise<{ success: boolean; data: Customer }> => {
    return httpClient.get(ENDPOINTS.ADMIN.CUSTOMER_DETAIL(id))
  },

  updateCustomer: async (id: string, payload: UpdateCustomerRequest): Promise<{ success: boolean; message: string }> => {
    return httpClient.patch(ENDPOINTS.ADMIN.CUSTOMER_UPDATE(id), payload)
  }
}
