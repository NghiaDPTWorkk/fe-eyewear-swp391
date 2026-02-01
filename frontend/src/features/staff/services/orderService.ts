import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { OrdersResponse } from '@/shared/types/operationOrder.types'

export const orderService = {
  /**
   * Lấy danh sách orders với pagination và filter
   * @param page - Số trang (default: 1)
   * @param limit - Số lượng items mỗi trang (default: 10)
   * @param status - Filter theo status (optional)
   * @param type - Filter theo type (optional)
   */
  getOrders: async (page: number, limit: number, status?: string, type?: string) => {
    return httpClient.get<OrdersResponse>(
      ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, status, type)
    )
  },

  /**
   * Lấy chi tiết một order
   * @param id - Order ID
   */
  getOrderById: async (id: string) => {
    return httpClient.get(ENDPOINTS.ORDERS.DETAIL(id))
  }
}
