import { useQuery } from '@tanstack/react-query'
import type { OrderResponse } from '@/shared/types'
import { orderAdminService } from '@/shared/services/admin/orderService'

export function useGetOrderById(orderId?: string | null, enabled = true) {
  return useQuery<OrderResponse>({
    queryKey: ['admin-order-detail', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('orderId is required')
      }
      return orderAdminService.getOrderById(orderId)
    },
    enabled: enabled && !!orderId,
    staleTime: 30_000
  })
}
