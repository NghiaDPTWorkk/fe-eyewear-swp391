import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/api'

type OnboardInvoiceResponse = {
  success: boolean
  message: string
  data?: unknown
}

export function useOnboard() {
  const mutation = useMutation({
    mutationFn: (invoiceId: string) =>
      httpClient.patch<OnboardInvoiceResponse>(`/admin/invoices/${invoiceId}/onboard`)
  })

  return {
    onboard: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}
