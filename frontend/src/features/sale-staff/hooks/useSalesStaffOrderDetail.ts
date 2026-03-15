import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'

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
