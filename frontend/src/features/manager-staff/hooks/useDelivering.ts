import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, httpClient } from '@/api'

type DeliveringInvoiceResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useDelivering() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (invoiceId: string) =>
      httpClient.patch<DeliveringInvoiceResponse>(ENDPOINTS.ADMIN.INVOICES_DELIVERING(invoiceId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-invoices-handle-delivery'] })
    }
  })

  return {
    delivering: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}
