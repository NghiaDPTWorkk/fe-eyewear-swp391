import { ENDPOINTS, httpClient } from '@/api'
import type { AdminOrderDetailApiResponse } from '@/shared/types/admin-order.types'
import type { OrdersResponse } from '@/shared/types/operationOrder.types'

export const orderAdminService = {
  getOrderById(orderId: string) {
    return httpClient.get<AdminOrderDetailApiResponse>(ENDPOINTS.ADMIN.ORDER_DETAIL(orderId))
  },

  assignStaff(orderId: string, assignedStaff: string) {
    return httpClient.patch<AdminOrderDetailApiResponse>(ENDPOINTS.ADMIN.ORDER_ASSIGN(orderId), {
      assignedStaff
    })
  },

  getAllOrders(page = 1, limit = 1000, status?: string, type?: string) {
    return httpClient.get<OrdersResponse>(ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, status, type))
  }
}
