import { ENDPOINTS, httpClient } from '@/api'
import type {
  CreateInvoiceRequest,
  CreateInvoiceApiResponse,
  GetInvoicesApiResponse,
  InvoiceDetailApiResponse
} from '@/shared/types/invoice.types'

export const invoiceService = {
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

  getInvoiceDetail: async (id: string): Promise<InvoiceDetailApiResponse> => {
    try {
      const response = await httpClient.get<InvoiceDetailApiResponse>(ENDPOINTS.INVOICE.DETAIL(id))
      return response
    } catch (error: any) {
      console.error('Failed to get invoice detail:', error)
      throw error
    }
  }
}
