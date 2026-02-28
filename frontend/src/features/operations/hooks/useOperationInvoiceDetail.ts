import { useQuery } from '@tanstack/react-query'
import type { OperationInvoiceListItem } from '@/shared/types'
import { operationInvoiceService } from '../services/operationInvoiceService'

/**
 * Fetches a single invoice by ID from the handle-delivery list.
 * Uses OperationInvoiceListItem which contains orders: string[].
 */
export function useOperationInvoiceDetail(invoiceId: string) {
  return useQuery<OperationInvoiceListItem | undefined>({
    queryKey: ['operation-invoice-detail', invoiceId],
    queryFn: async () => {
      const response = await operationInvoiceService.getHandleDeliveryInvoices(1, 100)
      return response.data?.invoiceList?.find((inv) => inv.id === invoiceId)
    },
    enabled: Boolean(invoiceId),
    staleTime: 30_000
  })
}
