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
   * Fetch deposit invoices (Pre-orders)
   */
  getInvoicesDeposit: async (): Promise<any[]> => {
    const response = await httpClient.get<any>(ENDPOINTS.INVOICES.DEPOSIT)
    const data = response.data?.data || response.data?.items || response.data || response || []
    return Array.isArray(data) ? data : []
  },

  /**
   * Fetch all orders for staff
   */
  getOrders: async (): Promise<any> => {
    const url = ENDPOINTS.ORDERS.ADMIN_LIST || '/orders'
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
    const url = ENDPOINTS.ORDERS.ADMIN_DETAIL(orderId.toString())
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
  /**
   * Reject an invoice
   */
  rejectInvoice: (invoiceId: string | number) => {
    return httpClient.put(ENDPOINTS.INVOICES.REJECT(invoiceId.toString()))
  },

  /**
   * Approve an invoice
   */
  approveInvoice: (invoiceId: string | number) => {
    return httpClient.put(ENDPOINTS.INVOICES.APPROVE(invoiceId.toString()))
  }
}
