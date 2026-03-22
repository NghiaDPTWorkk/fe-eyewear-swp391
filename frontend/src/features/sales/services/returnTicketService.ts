import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ListReturnTicketResponse } from '@/shared/types/return-ticket.types'

export interface ReturnTicketListParams {
  page?: number
  limit?: number
  status?: string
  orderId?: string
  customerId?: string
  staffVerify?: string
  search?: string
}

export const returnTicketService = {
  /**
   * GET /api/v1/admin/return-tickets
   * All tickets list
   */
  getAllTickets: async (params: ReturnTicketListParams = {}) => {
    return httpClient.get<ListReturnTicketResponse>(
      ENDPOINTS.RETURN_TICKETS.ADMIN_LIST({ ...params })
    )
  },

  /**
   * GET /api/v1/admin/return-tickets/my-history
   * Processed tickets list
   */
  getMyHistory: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    return httpClient.get<ListReturnTicketResponse>(
      ENDPOINTS.RETURN_TICKETS.MY_HISTORY({ ...params })
    )
  },

  /**
   * GET /api/v1/admin/return-tickets/returned-orders
   * Returns completed tickets (RETURNED, APPROVED, REJECTED)
   */
  getReturnedOrders: async (page = 1, limit = 10, search?: string) => {
    return httpClient.get<ListReturnTicketResponse>(
      ENDPOINTS.RETURN_TICKETS.RETURNED_ORDERS(page, limit, search)
    )
  },

  /**
   * PATCH /api/v1/admin/return-tickets/:id/staff-verify
   * Assign self to a ticket (claim it)
   */
  claimTicket: async (id: string) => {
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.RETURN_TICKETS.STAFF_VERIFY(id),
      {}
    )
  },

  /**
   * PATCH /api/v1/admin/return-tickets/:id/status/approve
   */
  approveTicket: async (id: string, note?: string) => {
    const text = note || 'Approved by staff'
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.RETURN_TICKETS.UPDATE_STATUS(id, 'approved'),
      { staffNote: text, note: text }
    )
  },

  /**
   * PATCH /api/v1/admin/return-tickets/:id/status/reject
   */
  rejectTicket: async (id: string, note?: string) => {
    const text = note || 'Rejected by staff'
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.RETURN_TICKETS.UPDATE_STATUS(id, 'rejected'),
      { staffNote: text, note: text }
    )
  },

  /**
   * PATCH /api/v1/admin/return-tickets/:id/status/in_progress
   */
  startProcessing: async (id: string, note?: string) => {
    return httpClient.patch<{ success: boolean; message: string }>(
      ENDPOINTS.RETURN_TICKETS.UPDATE_STATUS(id, 'in_progress'),
      { staffNote: note, note: note }
    )
  }
}
