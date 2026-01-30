import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { OrderListResponse } from '@/shared/types/order.types'

export const orderService = {
  // Get all orders with pagination
  getOrders(page: number, limit: number) {
    return httpClient.get<ApiResponse<OrderListResponse>>(
      `${ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`
    )
  },

  // Get orders by type with pagination
  getOrdersByType(page: number, limit: number, type: string) {
    return httpClient.get<ApiResponse<OrderListResponse>>(
      `${ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}&type=${type}`
    )
  },

  // Get orders by status with pagination (for tabs like 'Pending', 'Processing')
  getOrdersByStatus(page: number, limit: number, status: string) {
    return httpClient.get<ApiResponse<OrderListResponse>>(
      `${ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}&status=${status}`
    )
  }
}
