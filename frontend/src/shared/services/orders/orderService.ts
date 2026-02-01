import { ENDPOINTS, httpClient } from '@/api'
import type { Order } from '@/shared/types'

export const orderService = {
  getAllOrdersByUserId: async () => {
    const response = await httpClient.get(ENDPOINTS.ORDERS.LIST)
    return response
  },

  createOrder: async (orderData: Order) => {
    const response = await httpClient.post(ENDPOINTS.ORDERS.CREATE, orderData)
    return response
  },

  getOrderDetail: async (id: string) => {
    const response = await httpClient.get(ENDPOINTS.ORDERS.DETAIL(id))
    return response
  },

  cancelOrder: async (id: string) => {
    const response = await httpClient.post(ENDPOINTS.ORDERS.CANCEL(id))
    return response
  },

  trackOrder: async (id: string) => {
    const response = await httpClient.get(ENDPOINTS.ORDERS.TRACKING(id))
    return response
  }
}
