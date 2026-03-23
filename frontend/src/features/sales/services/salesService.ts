import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminInvoiceListApiResponse } from '@/shared/types'

import type { Order } from '../types'

export const salesService = {
  getDepositedInvoices: async (
    page: number,
    limit: number,
    status?: string,
    statuses?: string,
    search?: string
  ) => {
    return httpClient.get<AdminInvoiceListApiResponse>(
      ENDPOINTS.ADMIN.INVOICES(page, limit, status, statuses, search)
    )
  },

  getOrderById: async (id: string) => {
    return httpClient.get<{ success: boolean; data: { order: Order } }>(ENDPOINTS.ORDERS.DETAIL(id))
  },

  rejectInvoice: async (id: string, note?: string) => {
    return httpClient.patch(ENDPOINTS.ADMIN.INVOICE_REJECT(id), {
      note: note || 'Rejected by staff'
    })
  },

  approveInvoice: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ADMIN.INVOICE_APPROVE(id), {})
  },

  getOrdersTotal: async (invoiceId: string, status?: string) => {
    return httpClient.get<{ success: boolean; data: { total: number } }>(
      ENDPOINTS.ADMIN.ORDERS_TOTAL(invoiceId, status)
    )
  },

  approveOrder: async (id: string, data?: { parameters: any; note?: string }) => {
    return httpClient.patch(ENDPOINTS.ADMIN.ORDER_APPROVE(id), data || {})
  },

  getManufacturingOrders: async (page: number = 1, limit: number = 10) => {
    return httpClient.get<any>(
      ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, undefined, 'MANUFACTURING')
    )
  },

  getInvoiceById: async (id: string) => {
    return httpClient.get<any>(ENDPOINTS.OPERATION_STAFF.INVOICE_DETAIL(id))
  },

  getCustomerById: async (id: string) => {
    return httpClient.get<any>(`/admin/customers/${id}`)
  },

  getStaffById: async (id: string) => {
    return httpClient.get<{ success: boolean; data: any }>(`/admin/admin-accounts/${id}`)
  }
}
