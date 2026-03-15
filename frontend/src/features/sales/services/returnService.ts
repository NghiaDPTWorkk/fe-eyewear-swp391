import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ListReturnTicketResponse,
  ReturnTicketResponse
} from '@/shared/types/return-ticket.types'

export const returnService = {
  getReturnTickets: async (params: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) => {
    return httpClient.get<ListReturnTicketResponse>(ENDPOINTS.RETURN_TICKETS.ADMIN_LIST(params))
  },

  getReturnTicketDetail: async (id: string) => {
    return httpClient.patch<ReturnTicketResponse>(ENDPOINTS.RETURN_TICKETS.STAFF_VERIFY(id), {})
  },

  updateReturnTicketStatus: async (id: string, status: 'APPROVED' | 'REJECTED') => {
    return httpClient.patch<ReturnTicketResponse>(
      ENDPOINTS.RETURN_TICKETS.UPDATE_STATUS(id, status),
      {}
    )
  }
}
