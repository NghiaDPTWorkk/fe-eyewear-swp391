import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, ReturnTicketListResponse } from '@/shared/types'

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
