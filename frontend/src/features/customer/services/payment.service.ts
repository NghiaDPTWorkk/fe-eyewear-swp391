import { ENDPOINTS, httpClient } from '@/api'

export interface VNPayUrlResponse {
  success: boolean
  message: string
  data: {
    url: string
  }
}

export const paymentService = {
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
