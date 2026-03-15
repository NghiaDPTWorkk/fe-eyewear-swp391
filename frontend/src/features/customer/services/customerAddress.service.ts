import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { Address } from '@/shared/types'

export const customerAddressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get(ENDPOINTS.AUTH.ADDRESS_LIST)
    return response.data.data.addresses
  },

  addAddress: async (address: Omit<Address, '_id'>): Promise<Address> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.ADDRESS_ADD, address)
    return response.data.data
  },

  setDefaultAddress: async (id: string, address: Address): Promise<void> => {
    await apiClient.patch(ENDPOINTS.AUTH.CHANGE_DEFAULT(id), address)
  }
}
