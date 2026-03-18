import { ENDPOINTS, httpClient } from '@/api'
import type { AdminInvoiceDetailResponse, OperationInvoiceListApiResponse } from '@/shared/types'

export const operationInvoiceService = {
  getHandleDeliveryInvoices(page: number, limit: number, status?: string, search?: string) {
    return httpClient.get<OperationInvoiceListApiResponse>(
      ENDPOINTS.OPERATION_STAFF.INVOICES_HANDLE_DELIVERY(page, limit, status, search)
    )
  },
  getInvoiceById(id: string) {
    return httpClient.get<AdminInvoiceDetailResponse>(ENDPOINTS.OPERATION_STAFF.INVOICE_DETAIL(id))
  },
  updateInvoiceToReadyToShip(id: string) {
    return httpClient.patch(ENDPOINTS.ADMIN.INVOICES_READY_TO_SHIP(id), {})
  },
  getShipCode(invoiceId: string) {
    return httpClient.get<{ data: { shipCode: string } }>(
      ENDPOINTS.ADMIN.INVOICES_SHIP_CODE(invoiceId)
    )
  }
}
