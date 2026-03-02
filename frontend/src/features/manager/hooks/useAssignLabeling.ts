import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, httpClient } from '@/api'

type AssignLabelingResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useAssignLabeling() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ invoiceId, assignedStaff }: { invoiceId: string; assignedStaff: string }) =>
      httpClient.patch<AssignLabelingResponse>(ENDPOINTS.ADMIN.INVOICES_READY_TO_SHIP(invoiceId), {
        assignedStaff
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices'] })
    }
  })

  return {
    assignLabeling: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error
  }
}
