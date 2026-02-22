export interface AdminInvoiceListOrderItem {
  id: string
  _id?: string
  type: string[]
}

export interface AdminInvoiceListItem {
  id: string
  _id?: string
  invoiceCode: string
  fullName: string
  phone: string
  finalPrice: string
  status: string
  createdAt: string
  address: string
  orders?: AdminInvoiceListOrderItem[]
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
