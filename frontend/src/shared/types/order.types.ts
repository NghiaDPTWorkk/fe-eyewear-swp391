import type { OrderType, OrderStatus, AssignmentOrderStatus } from './enums'
import type { Address } from './address.types'
import type { LensParameters, OrderProduct } from './order-item.types'
import type { Invoice } from './invoice.types'

/**
 * Order product structure matching backend - Imported from order-item.types.ts
 */

export interface Order {
  _id: string
  type: OrderType
  status: OrderStatus
  assignmentStatus: AssignmentOrderStatus
  products: OrderProduct[]
  // Flattened assignment fields
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
  products?: OrderProduct[]
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

export interface OrderResponse {
  order: Order
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
