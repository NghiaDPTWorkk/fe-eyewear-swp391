import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, RevenueStats, TopSalesStats } from '@/shared/types'

export function useRevenueStats(params: {
  period?: string
  fromDate?: string
  toDate?: string
  userId?: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: ['revenue-stats', params],
    enabled: params.enabled !== false,
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<RevenueStats>>(
        ENDPOINTS.REPORTS.REVENUE(params.period, params.fromDate, params.toDate, params.userId)
      )
      return res.data
    }
  })
}

export function useTopSalesStats(month?: number, year?: number) {
  return useQuery({
    queryKey: ['top-sales', month, year],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<TopSalesStats>>(
        ENDPOINTS.REPORTS.TOP_SALES(month, year)
      )
      return res.data
    }
  })
}
