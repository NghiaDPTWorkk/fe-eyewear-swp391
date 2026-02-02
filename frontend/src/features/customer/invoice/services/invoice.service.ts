import { ENDPOINTS, httpClient } from '@/api'
import type { CreateInvoiceRequest, CreateInvoiceApiResponse } from '@/shared/types/invoice.types'

/**
 * Invoice Service - Business logic layer for invoice operations
 */
export const invoiceService = {
  /**
   * Tạo hóa đơn mới (Checkout)
   * @param data - Thông tin tạo hóa đơn (sản phẩm, địa chỉ, khách hàng)
   * @returns Hóa đơn và thông tin thanh toán
   */
  createInvoice: async (data: CreateInvoiceRequest): Promise<CreateInvoiceApiResponse> => {
    try {
      const response = await httpClient.post<CreateInvoiceApiResponse>(
        ENDPOINTS.INVOICE.CREATE,
        data
      )
      return response
    } catch (error: any) {
      console.error('Failed to create invoice:', error)
      throw error
    }
  },

  /**
   * Lấy chi tiết hóa đơn
   * @param id - ID hóa đơn
   */
  getInvoiceDetail: async (id: string): Promise<CreateInvoiceApiResponse> => {
    try {
      const response = await httpClient.get<CreateInvoiceApiResponse>(ENDPOINTS.INVOICE.DETAIL(id))
      return response
    } catch (error: any) {
      console.error('Failed to get invoice detail:', error)
      throw error
    }
  }
}
