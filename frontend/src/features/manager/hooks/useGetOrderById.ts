import { useQuery } from '@tanstack/react-query'
import { orderAdminService } from '@/shared/services/admin/orderService'
export function useGetOrderById(orderId?: string | null, enabled = true) {
  return useQuery({
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
