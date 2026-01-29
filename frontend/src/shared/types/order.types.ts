import type { OrderType, OrderStatus, AssignmentOrderStatus, InvoiceStatus } from './enums'
import type { Address } from './address.types'

export interface LensParameters {
  left: {
    SPH: number
    CYL: number
    AXIS: number
  }
  right: {
    SPH: number
    CYL: number
    AXIS: number
  }
  PD: number
}

/**
 * Order product structure matching backend
 */
export interface OrderProductFrame {
  product_id: string
  sku: string
}

export interface OrderProductLens {
  lens_id: string
  sku: string
  parameters: LensParameters
}

export interface OrderProduct {
  product?: OrderProductFrame
  lens?: OrderProductLens
  quantity: number
}

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
export interface OrderTableRow {
  id: string
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
}

export interface Invoice {
  _id: string
  orders: string[] // Order IDs
  owner: string
  totalPrice: number
  voucher: string[]
  address: Address
  status: InvoiceStatus
  fullName: string
  phone: string
  totalDiscount: number
  manager_onboard?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

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

export interface InvoiceResponse {
  invoice: Invoice
}

export interface InvoiceListResponse {
  items: Invoice[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
