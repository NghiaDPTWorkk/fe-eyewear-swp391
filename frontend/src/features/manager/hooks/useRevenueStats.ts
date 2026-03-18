import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, RevenueStats } from '@/shared/types'

export function useRevenueStats(params: {
  period?: string
  fromDate?: string
  toDate?: string
  userId?: string
}) {
  return useQuery({
    queryKey: ['revenue-stats', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<RevenueStats>>(
        ENDPOINTS.REPORTS.REVENUE(params.period, params.fromDate, params.toDate, params.userId)
      )
      return res.data
    }
  })
}
