import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminInvoiceListApiResponse } from '@/shared/types'

import type { Order } from '../types'

export const salesService = {
  getDepositedInvoices: async (page: number, limit: number, status?: string) => {
    return httpClient.get<AdminInvoiceListApiResponse>(
      ENDPOINTS.ADMIN.INVOICES(page, limit, status)
    )
  },

  getOrderById: async (id: string) => {
    return httpClient.get<{ success: boolean; data: { order: Order } }>(ENDPOINTS.ORDERS.DETAIL(id))
  },

  rejectInvoice: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ADMIN.INVOICE_REJECT(id), {})
  },

  approveInvoice: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ADMIN.INVOICE_APPROVE(id), {})
  },

  getOrdersTotal: async (invoiceId: string, status?: string) => {
    return httpClient.get<{ success: boolean; data: { total: number } }>(
      ENDPOINTS.ADMIN.ORDERS_TOTAL(invoiceId, status)
    )
  },

  approveOrder: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ADMIN.ORDER_APPROVE(id), {})
  }
}
