import { ENDPOINTS, httpClient } from '@/api'

export interface VNPayUrlResponse {
  success: boolean
  message: string
  data: {
    url: string
  }
}

export const paymentService = {
  /**
   * Get VNPay payment URL
   * @param invoiceId - The ID of the invoice
   * @param paymentId - The ID of the payment
   */
  getVNPayUrl: async (invoiceId: string, paymentId: string): Promise<VNPayUrlResponse> => {
    try {
      const response = await httpClient.get<VNPayUrlResponse>(
        ENDPOINTS.PAYMENT.VNPAY_URL(invoiceId, paymentId)
      )
      return response
    } catch (error: any) {
      console.error('Failed to get VNPay URL:', error)
      throw error
    }
  },

  /**
   * Get PayOS payment URL
   * @param invoiceId - The ID of the invoice
   * @param paymentId - The ID of the payment
   */
  getPayOSUrl: async (invoiceId: string, paymentId: string): Promise<VNPayUrlResponse> => {
    try {
      const response = await httpClient.get<VNPayUrlResponse>(
        ENDPOINTS.PAYMENT.PAYOS_URL(invoiceId, paymentId)
      )
      return response
    } catch (error: any) {
      console.error('Failed to get PayOS URL:', error)
      throw error
    }
  }
}
