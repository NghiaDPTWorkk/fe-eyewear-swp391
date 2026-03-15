import type { OrderType, OrderStatus, AssignmentOrderStatus } from '@/shared/utils/enums/order.enum'
export type { OrderType, OrderStatus, AssignmentOrderStatus }
import type { Address } from './address.types'
import type { LensParameters } from './order-item.types'

import type { Invoice } from './invoice.types'

/**
 * Order product structure matching backend - Imported from order-item.types.ts
 */

export interface Order {
  _id: string
  type: OrderType
  status: OrderStatus
  assignmentStatus: AssignmentOrderStatus
  products: OrderProductItem[]
  staffId?: string | null
  assignStaff?: string | null
  assignedAt?: Date | null
  startedAt?: Date | null
  completedAt?: Date | null
  staffVerified?: string | null
  price: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

// Invoice interface is moved to invoice.types.ts

/**
 * Create order request matching backend ClientCreateOrderSchema
 */
export interface CreateOrderRequest {
  type: OrderType
  products: {
    product?: {
      product_id: string
      sku: string
    }
    lens?: {
      lens_id: string
      sku: string
      parameters: LensParameters
    }
    quantity: number
  }[]
  voucher?: string[]
  paymentMethod: string
  shippingAddress?: Address
  customerInfo?: {
    fullName: string
    phone: string
  }
  note?: string
  status?: OrderStatus
}

/**
 * Update order request matching backend ClientUpdateOrderSchema
 */
export interface UpdateOrderRequest {
  type?: OrderType
  products?: OrderProductItem[]
  price?: number
  status?: OrderStatus
  staffVerified?: string | null
  assignmentStatus?: AssignmentOrderStatus
  staffId?: string | null
  assignStaff?: string | null
  assignedAt?: Date | null
  startedAt?: Date | null
  completedAt?: Date | null
  voucher?: string[]
  paymentMethod?: string
  shippingAddress?: Address
  customerInfo?: {
    fullName: string
    phone: string
  }
  note?: string
}

export interface OrderDataResponse {
  order: Order
  assignerStaff: string
  assignedStaff: string
  assignedAt: string
  startedAt: string | null
  completedAt: string | null
  price: number
  deletedAt: string | null
  __v: 0
  createdAt: string
  updatedAt: string
}

export interface OrderResponse {
  success: boolean
  message: string
  data: OrderDataResponse | null
}

export interface OrderListResponse {
  items: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// InvoiceResponse is moved to invoice.types.ts

export interface InvoiceListResponse {
  items: Invoice[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function isManufacturingOrder(order: { type?: Array<string> | null }) {
  return Array.isArray(order.type) && order.type.includes('MANUFACTURING')
}
// API của t đừng xó nha

export interface OrderProductInfo {
  product_id: string // Required
  sku: string // Required - Bắt đầu bằng "FRAME-" hoặc "LENS-"
  pricePerUnit: number // Required
}

export interface OrderLensDetail {
  lens_id: string // Required
  sku: string // Required
  parameters: LensParameters // Thông số kỹ thuật
  pricePerUnit: number // Required
}

export type OrderLensData = OrderLensDetail

export interface TransformedLensData {
  prescription: Array<{
    eye: string
    sph: string
    cyl: string
    axis: string
    prism: string
    add: string
  }>
  details: Array<{
    label: string
    value: string
  }>
}

export type TransformedFrameData = Array<{
  label: string
  value: string
}>

export interface OrderProductItem {
  product: OrderProductInfo // REQUIRED - Frame hoặc Lens
  quantity: number // REQUIRED - Số lượng (min: 1)
  lens?: OrderLensDetail // OPTIONAL - Chỉ có khi Manufacturing Order
}

//----------------------------------------------------------------------
