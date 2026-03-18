import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, httpClient } from '@/api'

type CompleteInvoiceResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useComplete() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (invoiceId: string) =>
      httpClient.patch<CompleteInvoiceResponse>(ENDPOINTS.ADMIN.INVOICES_COMPLETE(invoiceId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-invoices-handle-delivery'] })
    }
  })

  return {
    complete: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}
