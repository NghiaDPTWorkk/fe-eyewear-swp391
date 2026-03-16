import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, ReturnedOrdersResponse } from '@/shared/types'

export function useReturnedOrders(params: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['returned-orders', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnedOrdersResponse>>(
        ENDPOINTS.RETURN_TICKETS.RETURNED_ORDERS(params.page, params.limit, params.search)
      )
      return res.data
    }
  })
}
