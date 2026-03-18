import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

export interface CreateReportPayload {
  title: string
  description: string
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  imageUrl?: string | null
}

export interface ReportTicket {
  id: string
  title: string
  description: string
  priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  imageUrl: string | null
  status: 'PENDING' | 'PROCESSED' | 'RESOLVED'
  processedBy: string | null
  createdBy: string
  createdAt: string
}

export interface ReportTicketResponse {
  success: boolean
  message: string
  data: {
    reportTicket: ReportTicket
  }
}

export interface ReportTicketsListResponse {
  success: boolean
  message: string
  data: {
    reportTicketList: ReportTicket[]
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export const supportService = {
  /**
   * Create a new report ticket
   * @param payload - The ticket details
   */
  createReportTicket: async (payload: CreateReportPayload): Promise<ReportTicketResponse> => {
    return httpClient.post<ReportTicketResponse>(ENDPOINTS.SUPPORT.REPORT_TICKETS, payload)
  },

  /**
   * Get report tickets for the current user
   */
  getReportTickets: async (): Promise<ReportTicketsListResponse> => {
    return httpClient.get<ReportTicketsListResponse>(ENDPOINTS.SUPPORT.REPORT_TICKETS)
  },

  /**
   * Get report ticket history for the current user
   */
  getMyHistory: async (): Promise<ReportTicketsListResponse> => {
    return httpClient.get<ReportTicketsListResponse>(ENDPOINTS.SUPPORT.MY_HISTORY)
  }
}
