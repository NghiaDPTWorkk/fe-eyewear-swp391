import { useMutation } from '@tanstack/react-query'
import { ENDPOINTS, httpClient } from '@/api'

type DeliveringInvoiceResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useDelivering() {
  const mutation = useMutation({
    mutationFn: (invoiceId: string) =>
      httpClient.patch<DeliveringInvoiceResponse>(ENDPOINTS.ADMIN.INVOICES_DELIVERING(invoiceId))
  })

  return {
    delivering: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}
