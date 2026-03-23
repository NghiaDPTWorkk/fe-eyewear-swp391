import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, ReturnTicketListResponse } from '@/shared/types'
import type { ReturnMonthlyReportData } from '@/shared/types/return-report.types'

export function useReturnTickets(params: {
  page?: number
  limit?: number
  status?: string
  orderId?: string
  customerId?: string
  staffVerify?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['return-tickets', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnTicketListResponse>>(
        ENDPOINTS.RETURN_TICKETS.ADMIN_LIST(params)
      )
      return res.data
    }
  })
}

export function useReturnMonthlyReport() {
  return useQuery({
    queryKey: ['return-tickets', 'monthly-report'],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnMonthlyReportData>>(
        ENDPOINTS.RETURN_TICKETS.MONTHLY_REPORT
      )
      return res.data
    }
  })
}
