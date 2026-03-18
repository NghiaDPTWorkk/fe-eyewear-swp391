import { apiClient } from '@/lib/axios'
import { ENDPOINTS } from '@/api/endpoints'
import type { Address } from '@/shared/types'

export const customerAddressService = {
  /**
   * Get all addresses for the current customer
   */
  getAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get(ENDPOINTS.AUTH.ADDRESS_LIST)
    return response.data.data.addresses
  },

  /**
   * Add a new address
   */
  addAddress: async (address: Omit<Address, '_id'>): Promise<Address> => {
    const response = await apiClient.post(ENDPOINTS.AUTH.ADDRESS_ADD, address)
    return response.data.data
  },

  /**
   * Set an address as default
   */
  setDefaultAddress: async (id: string, address: Address): Promise<void> => {
    await apiClient.patch(ENDPOINTS.AUTH.CHANGE_DEFAULT(id), address)
  }
}
