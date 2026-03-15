import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { OrdersResponse } from '@/shared/types/operationOrder.types'
import type { AdminInvoiceDetailResponse } from '@/shared/types/admin-invoice.types'

export const orderService = {
  getOrders: async (page: number, limit: number, status?: string, type?: string) => {
    return httpClient.get<OrdersResponse>(
      ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, status, type)
    )
  },

  getOrderById: async (id: string) => {
    return httpClient.get(ENDPOINTS.ORDERS.DETAIL(id))
  },

  searchByOrderCode: async (orderCode: string) => {
    return httpClient.get<OrdersResponse>(ENDPOINTS.ORDERS.SEARCH_BY_CODE(orderCode))
  },

  getInvoiceById: async (invoiceId: string) => {
    return httpClient.get<AdminInvoiceDetailResponse>(
      ENDPOINTS.OPERATION_STAFF.INVOICE_DETAIL(invoiceId)
    )
  },

  updateOrder: async (id: string, data: any) => {
    return httpClient.put(ENDPOINTS.ORDERS.UPDATE(id), data)
  },

  updateStatusToMaking: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_MAKING(id), {})
  },

  updateStatusToPackaging: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_PACKAGING(id), {})
  },

  updateStatusToCompleted: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_COMPLETED(id), {})
  },

  approveOrder: async (id: string, data: { parameters: any }) => {
    return httpClient.patch(ENDPOINTS.ADMIN.ORDER_APPROVE(id), data)
  }
}
