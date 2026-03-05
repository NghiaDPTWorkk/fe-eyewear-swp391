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
  },

  /**
   * Cập nhật thông tin order (status, ...)
   * @param id - Order ID
   * @param data - Dữ liệu cần update
   */
  updateOrder: async (id: string, data: any) => {
    return httpClient.put(ENDPOINTS.ORDERS.UPDATE(id), data)a
  },

  /**
   * Cập nhật trạng thái order sang MAKING
   * @param id - Order ID
   */
  updateStatusToMaking: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_MAKING(id), {})
  },

  /**
   * Cập nhật trạng thái order sang PACKAGING
   * @param id - Order ID
   */
  updateStatusToPackaging: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_PACKAGING(id), {})
  },

  /**
   * Cập nhật trạng thái order sang COMPLETED
   * @param id - Order ID
   */
  updateStatusToCompleted: async (id: string) => {
    return httpClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS_COMPLETED(id), {})
  }
}
