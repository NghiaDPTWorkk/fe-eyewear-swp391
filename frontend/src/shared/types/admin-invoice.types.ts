export interface AdminInvoiceListItem {
  id: string
  invoiceCode: string
  fullName: string
  phone: string
  finalPrice: string
  status: string
  createdAt: string
  address: string
}

export interface AdminInvoiceListPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminInvoiceListData {
  pagination: AdminInvoiceListPagination
  invoiceList: AdminInvoiceListItem[]
}

export interface AdminInvoiceListApiResponse {
  success: boolean
  message: string
  data: AdminInvoiceListData
}
