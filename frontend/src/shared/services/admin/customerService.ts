import { ENDPOINTS } from '@/api/endpoints'
import { httpClient } from '@/api/apiClients'
import type { AdminCustomerParams, AdminCustomerListResponse } from '@/shared/types/customer.types'

export const customerService = {
  getCustomers: (params?: AdminCustomerParams): Promise<AdminCustomerListResponse> => {
    return httpClient.get(
      ENDPOINTS.ADMIN.CUSTOMERS_LIST(params?.page, params?.limit, params?.search, params?.status)
    )
  }
}
