import { useQuery } from '@tanstack/react-query'
import type { AdminInvoiceListApiResponse } from '@/shared/types'
import { invoiceAdminService } from '@/shared/services/admin/invoiceService'

export function useAdminInvoices(page: number, limit: number) {
  return useQuery<AdminInvoiceListApiResponse>({
    queryKey: ['admin-invoices', page, limit],
    queryFn: () => invoiceAdminService.getInvoices(page, limit),
    staleTime: 30_000
  })
}
