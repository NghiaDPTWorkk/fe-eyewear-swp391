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
  staffHandleDelivery?: string
  staffHandleDeliveryName?: string
  assignStaffHandleDeliveryAt?: string
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

/** Shape của GET /admin/invoices/:id */
export interface AdminInvoiceAddress {
  street: string
  ward: string
  city: string
  country?: string
}

export interface AdminInvoiceDetail {
  _id: string
  invoiceCode: string
  owner: string
  fullName: string
  phone: string
  address: AdminInvoiceAddress
  feeShip: number
  totalPrice: number
  totalDiscount: number
  voucher: string[]
  status: string
  note?: string | null
  managerOnboard?: string | null
  onboardedAt?: string | null
  staffHandleDelivery?: string | null
  assignStaffHandleDeliveryAt?: string | null
  staffVerified?: string | null
  verifiedAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface AdminInvoiceDetailResponse {
  success: boolean
  message: string
  data: AdminInvoiceDetail
}

/** Shape of GET /admin/invoices/handle-delivery */
export interface OperationInvoiceOrder {
  id: string
  orderCode?: string
  status?: string
  type?: string[]
}

export interface OperationInvoiceListItem {
  id: string
  invoiceCode: string
  fullName: string
  phone: string
  address?: string
  finalPrice: string
  status: string
  createdAt: string
  orders: string[]
}

export interface OperationInvoiceListPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface OperationInvoiceListData {
  pagination: OperationInvoiceListPagination
  invoiceList: OperationInvoiceListItem[]
}

export interface OperationInvoiceListApiResponse {
  success: boolean
  message: string
  data: OperationInvoiceListData
}
