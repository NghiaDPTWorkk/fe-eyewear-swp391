import { useQuery } from '@tanstack/react-query'
import type { OperationInvoiceListApiResponse } from '@/shared/types'
import { operationInvoiceService } from '../services/operationInvoiceService'

export function useOperationInvoices(page: number, limit: number, status?: string, search?: string) {
  return useQuery<OperationInvoiceListApiResponse>({
    queryKey: ['operation-invoices-handle-delivery', page, limit, status, search],
    queryFn: () => operationInvoiceService.getHandleDeliveryInvoices(page, limit, status, search),
    staleTime: 30_000
  })
}

export function useSearchInvoices(invoiceCode: string) {
  return useQuery<OperationInvoiceListApiResponse>({
    queryKey: ['operation-invoices-search', invoiceCode],
    queryFn: () => operationInvoiceService.getHandleDeliveryInvoices(1, 10, undefined, invoiceCode),
    enabled: invoiceCode.trim().length >= 2,
    staleTime: 10000,
    refetchOnWindowFocus: false
  })
}

export function useAllOperationInvoices() {
  return useQuery<OperationInvoiceListApiResponse>({
    queryKey: ['operation-invoices-handle-delivery', 'all'],
    queryFn: () => operationInvoiceService.getHandleDeliveryInvoices(1, 1000), // Lấy tối đa 1000 đơn để đếm
    staleTime: 0 // Đảm bảo luôn refetch khi bị invalidate hoặc quay lại trang
  })
}
