import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'

export function useOrderTypeStats(enabled: boolean = true) {
  const query = useQuery({
    queryKey: ['sales', 'stats', 'order-type-total'],
    queryFn: async () => {
      const response = await salesService.getOrderTypeStats()
      return response.data
    },
    enabled,
    staleTime: 0 // Always fetch fresh data for stats
  })

  return {
    stats: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch
  }
}
