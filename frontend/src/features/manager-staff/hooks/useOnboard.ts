import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ENDPOINTS, httpClient } from '@/api'

type OnboardInvoiceResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useOnboard() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (invoiceId: string) =>
      httpClient.patch<OnboardInvoiceResponse>(ENDPOINTS.ADMIN.INVOICES_ONBOARD(invoiceId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invoices-enriched'] })
    }
  })

  return {
    onboard: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}
