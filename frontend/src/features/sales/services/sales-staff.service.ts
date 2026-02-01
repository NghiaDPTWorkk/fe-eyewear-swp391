import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { Invoice, LensParameter } from '../types'

/**
 * Service handling all API calls for Sales Staff
 */
export const salesStaffService = {
  /**
   * Fetch all invoices
   */
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await httpClient.get<any>('/invoices')
    const data = response.data?.data || response.data?.items || response.data || response || []
    return Array.isArray(data) ? data : []
  },

  /**
   * Fetch all orders for staff
   */
  getOrders: async (): Promise<any> => {
    const url = ENDPOINTS.ORDERS.LIST || '/orders'
    const response = await httpClient.get<any>(url)
    return (
      response.data?.orders?.data ||
      response.data?.items ||
      response.data?.data ||
      response.data ||
      response ||
      []
    )
  },

  /**
   * Fetch a single order detail
   */
  getOrderDetail: async (orderId: string | number): Promise<any> => {
    const url = ENDPOINTS.ORDERS.DETAIL(orderId.toString())
    const response = await httpClient.get<any>(url)
    return response.data?.data || response.data || response
  },

  /**
   * Verify an order with prescription details
   */
  verifyOrder: (orderId: string | number, lensParameter: LensParameter) => {
    return httpClient.patch(`/orders/${orderId}`, { lensParameter })
  },

  /**
   * Cancel an invoice (reject order)
   */
  rejectInvoice: (invoiceId: string | number) => {
    return httpClient.patch(`/invoices/${invoiceId}/cancel`)
  }
}
