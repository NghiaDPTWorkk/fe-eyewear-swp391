import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export function useUpdateInvoiceReadyToShip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invoiceId: string) => operationInvoiceService.updateInvoiceToReadyToShip(invoiceId),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ['operation-invoice-detail', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['operation-invoices'] })
    }
  })
}

export function useOperationShipCode(invoiceId: string) {
  return useQuery({
    queryKey: ['operation-shipcode', invoiceId],
    queryFn: async () => {
      try {
        const response = await operationInvoiceService.getShipCode(invoiceId)
        return response.data?.shipCode || null
      } catch (error) {
        return null // If API fails (e.g., 404 ship not found), return null
      }
    },
    enabled: Boolean(invoiceId),
    staleTime: 30_000,
    retry: false
  })
}
