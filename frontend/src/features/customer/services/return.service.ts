import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ReturnTicketRequest,
  ReturnTicketResponse,
  ListOrderByInvoiceResponse,
  ListReturnTicketResponse
} from '@/shared/types/return-ticket.types'

export const returnService = {
  createReturnTicket: async (data: ReturnTicketRequest): Promise<ReturnTicketResponse> => {
    return httpClient.post<ReturnTicketResponse>(ENDPOINTS.RETURN_TICKETS.CREATE, data)
  },

  getOrdersByInvoice: async (invoiceId: string): Promise<ListOrderByInvoiceResponse> => {
    return httpClient.get<ListOrderByInvoiceResponse>(ENDPOINTS.ORDERS.LIST_BY_INVOICE(invoiceId))
  },

  getReturnTickets: async (
    page: number = 1,
    limit: number = 100,
    status?: string
  ): Promise<ListReturnTicketResponse> => {
    return httpClient.get<ListReturnTicketResponse>(
      ENDPOINTS.RETURN_TICKETS.CLIENT_LIST(page, limit, status)
    )
  }
}
