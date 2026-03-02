import { ENDPOINTS, httpClient } from '@/api'
import type { AdminInvoiceDetailResponse, OperationInvoiceListApiResponse } from '@/shared/types'

export const operationInvoiceService = {
  getHandleDeliveryInvoices(page: number, limit: number, status?: string) {
    return httpClient.get<OperationInvoiceListApiResponse>(
      ENDPOINTS.OPERATION_STAFF.INVOICES_HANDLE_DELIVERY(page, limit, status)
    )
  },
  getInvoiceById(id: string) {
    return httpClient.get<AdminInvoiceDetailResponse>(ENDPOINTS.OPERATION_STAFF.INVOICE_DETAIL(id))
  }
}
