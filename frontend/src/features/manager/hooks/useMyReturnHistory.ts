import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import type { ApiResponse, ReturnTicketListResponse } from '@/shared/types'

export function useMyReturnHistory(params: {
  page?: number
  limit?: number
  status?: string
  orderId?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['my-return-history', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnTicketListResponse>>(
        `/admin/return-tickets/my-history?${new URLSearchParams(params as any).toString()}`
      )
      return res.data
    }
  })
}
