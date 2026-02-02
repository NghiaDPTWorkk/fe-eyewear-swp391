import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { Invoice } from '../types'

export const invoiceService = {
  getDepositedInvoices: async () => {
    const response = await httpClient.get<ApiResponse<Invoice[]>>(
      ENDPOINTS.ADMIN.INVOICES_DEPOSITED
    )
    return response.data
  },

  approveInvoice: async (id: string) => {
    const response = await httpClient.patch<ApiResponse<unknown>>(
      ENDPOINTS.ADMIN.INVOICES_APPROVE(id)
    )
    return response.data
  },

  rejectInvoice: async (id: string) => {
    const response = await httpClient.patch<ApiResponse<unknown>>(
      ENDPOINTS.ADMIN.INVOICES_REJECT(id)
    )
    return response.data
  }
}
