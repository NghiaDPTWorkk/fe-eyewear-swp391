import type { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { OrderStatus, OrderType } from '@/shared/utils/enums/order.enum'

export interface Invoice {
  id: string
  invoiceCode: string
  fullName: string
  phone: string
  email?: string
  finalPrice: string
  status: InvoiceStatus | string
  address: string
  createdAt: string
  orders: {
    id: string
    type: OrderType[]
    status: OrderStatus | string
    isPrescription?: boolean
  }[]
  approvedOrdersCount?: number
  totalOrdersCount?: number
  hasManufacturing?: boolean
}

export interface OrderDetail {
  _id: string
  orderCode: string
  invoiceId: string
  type: OrderType[]
  status: OrderStatus | string
  price: number
  products: {
    product: {
      product_id: string
      sku: string
      product_name?: string
      pricePerUnit: number
    }
    quantity: number
    lens?: {
      lens_id: string
      sku: string
      parameters: {
        left: { SPH: number; CYL: number; AXIS: number }
        right: { SPH: number; CYL: number; AXIS: number }
        PD: number
      }
    }
    prescriptionImageUrl?: string
  }[]
  assignedAt?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt?: string
  customerName?: string
  customerPhone?: string
  isPrescription?: boolean
  invoice?: Invoice
  assignStaff?: string | null
  staffName?: string
  rejectionNote?: string
  rejectedAt?: string
  approvedAt?: string
  updatedAt?: string
}

export type Order = OrderDetail
