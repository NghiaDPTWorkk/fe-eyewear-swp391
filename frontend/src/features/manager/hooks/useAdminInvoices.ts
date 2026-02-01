import { useQuery } from '@tanstack/react-query'
import type { AdminInvoiceListApiResponse } from '@/shared/types'
import { invoiceAdminService } from '@/shared/services/admin/invoiceService'

export function useAdminInvoices(page: number, limit: number, status?: string) {
  return useQuery<AdminInvoiceListApiResponse>({
    queryKey: ['admin-invoices', page, limit, status],
    queryFn: () => invoiceAdminService.getInvoices(page, limit, status),
    staleTime: 30_000
  })
}
