import { ENDPOINTS, httpClient } from '@/api'
import type { AdminOrderDetailApiResponse } from '@/shared/types/admin-order.types'

export const orderAdminService = {
  getOrderById(orderId: string) {
    return httpClient.get<AdminOrderDetailApiResponse>(ENDPOINTS.ADMIN.ORDER_DETAIL(orderId))
  },

  assignStaff(orderId: string, assignedStaff: string) {
    return httpClient.patch<AdminOrderDetailApiResponse>(ENDPOINTS.ADMIN.ORDER_ASSIGN(orderId), {
      assignedStaff
    })
  }
}
