import { ENDPOINTS, httpClient } from '@/api'
import type { GetMyVouchersResponse } from '@/shared/types/voucher.types'

export const voucherService = {
  /**
   * Get list of vouchers available for the current customer
   */
  getMyVouchers: async (): Promise<GetMyVouchersResponse> => {
    try {
      const response = await httpClient.get<GetMyVouchersResponse>(ENDPOINTS.VOUCHERS.MY_VOUCHERS)
      return response
    } catch (error: any) {
      console.error('Failed to get my vouchers:', error)
      throw error
    }
  }
}
