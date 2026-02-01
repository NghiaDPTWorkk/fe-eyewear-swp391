import { ENDPOINTS, httpClient } from '@/api'
import type { AdminInvoiceListApiResponse } from '@/shared/types'

export const invoiceAdminService = {
  getInvoices(page: number, limit: number) {
    return httpClient.get<AdminInvoiceListApiResponse>(ENDPOINTS.ADMIN.INVOICES(page, limit))
  }
}
