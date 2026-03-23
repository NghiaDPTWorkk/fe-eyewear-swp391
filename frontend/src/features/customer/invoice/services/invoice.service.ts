import { ENDPOINTS, httpClient } from '@/api'
import type {
  CreateInvoiceRequest,
  CreateInvoiceApiResponse,
  GetInvoicesApiResponse,
  InvoiceDetailApiResponse
} from '@/shared/types/invoice.types'

interface CancelInvoiceApiResponse {
  success: boolean
  message: string
}

/**
 * Invoice Service - Business logic layer for invoice operations
 */
export const invoiceService = {
  /**
   * Lấy danh sách hóa đơn của người dùng
   * @param params - Tham số phân trang (page, limit)
   */
  getInvoices: async (params?: Record<string, any>): Promise<GetInvoicesApiResponse> => {
    try {
      const response = await httpClient.get<GetInvoicesApiResponse>(ENDPOINTS.INVOICE.LIST, {
        params
      })
      return response
    } catch (error: any) {
      console.error('Failed to get invoices:', error)
      throw error
    }
  },

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
  getInvoiceDetail: async (id: string): Promise<InvoiceDetailApiResponse> => {
    try {
      const response = await httpClient.get<InvoiceDetailApiResponse>(ENDPOINTS.INVOICE.DETAIL(id))
      return response
    } catch (error: any) {
      console.error('Failed to get invoice detail:', error)
      throw error
    }
  },

  cancelInvoice: async (id: string): Promise<CancelInvoiceApiResponse> => {
    try {
      const response = await httpClient.patch<CancelInvoiceApiResponse>(
        ENDPOINTS.INVOICE.CANCEL(id),
        {}
      )
      return response
    } catch (error: any) {
      console.error('Failed to cancel invoice:', error)
      throw error
    }
  }
}
