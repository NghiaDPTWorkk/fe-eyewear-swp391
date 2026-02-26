import { useQuery } from '@tanstack/react-query'
import type { OperationInvoiceListApiResponse } from '@/shared/types'
import { operationInvoiceService } from '../services/operationInvoiceService'

export function useOperationInvoices(page: number, limit: number, status?: string) {
  return useQuery<OperationInvoiceListApiResponse>({
    queryKey: ['operation-invoices-handle-delivery', page, limit, status],
    queryFn: () => operationInvoiceService.getHandleDeliveryInvoices(page, limit, status),
    staleTime: 30_000
  })
}
