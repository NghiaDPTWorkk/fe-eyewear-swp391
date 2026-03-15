import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderAdminService } from '@/shared/services/admin/orderService'

export function useAssignOrderStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, assignedStaff }: { orderId: string; assignedStaff: string }) =>
      orderAdminService.assignStaff(orderId, assignedStaff),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['admin-invoices-enriched'] })
    }
  })
}
