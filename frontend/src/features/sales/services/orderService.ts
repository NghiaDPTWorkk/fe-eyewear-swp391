import { httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { Order } from '../types'

export const orderService = {
  getOrders: async () => {
    const response = await httpClient.get<ApiResponse<Order[]>>('/admin/orders')
    return response.data
  },

  getOrderDetail: async (id: string | number) => {
    const response = await httpClient.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data
  }
}
