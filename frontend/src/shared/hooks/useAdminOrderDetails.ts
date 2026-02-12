import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'

import { orderAdminService } from '@/shared/services/admin/orderService'
import type {
  AdminOrderDetail,
  AdminOrderDetailApiResponse
} from '@/shared/types/admin-order.types'

export type UseAdminOrderDetailsParams = {
  orderIds: string[]
  enabled?: boolean
  staleTime?: number
}

export function useAdminOrderDetails({
  orderIds,
  enabled = true,
  staleTime = 30_000
}: UseAdminOrderDetailsParams) {
  const normalizedIds = useMemo(() => orderIds.filter(Boolean), [orderIds])

  const orderQueries = useQueries({
    queries: normalizedIds.map((orderId) => ({
      queryKey: ['admin-order-detail', orderId],
      queryFn: () => orderAdminService.getOrderById(orderId),
      enabled: enabled && !!orderId,
      staleTime
    }))
  })

  const hasAnyOrderLoading = orderQueries.some((q) => q.isLoading)
  const hasAnyOrderError = orderQueries.some((q) => q.isError)

  const ordersData = orderQueries
    .map((q) => (q.data as AdminOrderDetailApiResponse | undefined)?.data?.order)
    .filter(Boolean) as AdminOrderDetail[]

  return {
    orderQueries,
    ordersData,
    hasAnyOrderLoading,
    hasAnyOrderError
  }
}

