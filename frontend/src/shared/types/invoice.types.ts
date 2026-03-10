import type { Address } from './address.types'
import type { OrderProduct } from './order-item.types'
import type { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { PaymentMethodType } from '../utils/enums/payment.enum'
import type { Payment } from './payment.types'

export interface CreateInvoiceRequest {
  products: OrderProduct[]
  address: Address
  fullName: string
  phone: string
  voucher?: string[]
  paymentMethod: PaymentMethodType
  note?: string
}

export interface Invoice {
  _id: string
  invoiceCode: string
  orders: string[]
  owner: string
  totalPrice: number
  voucher: string[]
  address: Address
  status: InvoiceStatus
  fullName: string
  phone: string
  totalDiscount: number
  manager_onboard?: string | null
  staffVerified: string | null
  note?: string | null
  createdAt: string
  feeShip: number
  updatedAt: string
  deletedAt: string | null
  __v?: number
  productList?: InvoiceItem[]
}

export interface InvoiceResponse {
  invoice: Invoice
}

export interface PaginatedInvoiceResponse {
  data: Invoice[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface GetInvoicesApiResponse {
  success: boolean
  message: string
  data: PaginatedInvoiceResponse
}

export interface InvoiceProductDetail {
  sku: string
  name: string
  slug: string
  options: {
    attributeId: string
    attributeName: string
    label: string
    showType: string
    value: string
    _id: string
  }[]
  price: number
  finalPrice: number
  stock: number
  imgs: string[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  _id: string
}

export interface InvoiceItem {
  type: string[]
  quantity: number
  lens?: {
    product_id: string
    sku: string
    pricePerUnit: number
    detail: InvoiceProductDetail
  }
  product?: {
    product_id: string
    sku: string
    pricePerUnit: number
    detail: InvoiceProductDetail
  }
}

export interface InvoiceDetailData {
  invoiceStatus: string
  invoice: Invoice
  productList: InvoiceItem[]
}

export interface InvoiceDetailApiResponse {
  success: boolean
  message: string
  data: InvoiceDetailData
}

export interface CreateInvoiceApiResponse {
  success: boolean
  message: string
  data: {
    invoice: Invoice
    payment: Payment
  }
}
