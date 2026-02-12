import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

import { salesService } from '../services/salesService'
import type { Order } from '../types'

export function useSalesStaffOrders(page: number = 1, limit: number = 10, status: string = 'All') {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['sales', 'orders', { page, limit, status }],
    queryFn: async () => {
      const apiStatus = status === 'All' ? undefined : status
      const response = await httpClient.get<any>(
        ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, apiStatus)
      )
      return response.data
    }
  })

  const invalidateOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales', 'orders'] })
  }, [queryClient])

  const fetchOrders = useCallback(() => {
    query.refetch()
  }, [query])

  return {
    orders: (query.data?.orderList || []) as Order[],
    rxOrders: (query.data?.orderList || []) as Order[],
    pagination: query.data?.pagination || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    invalidateOrders,
    fetchOrders
  }
}

export function useSalesStaffOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      const response = await salesService.getOrderById(orderId)
      return response.data.order
    },
    enabled: !!orderId
  })
}
