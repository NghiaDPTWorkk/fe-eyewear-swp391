import type { OrderType, OrderStatus, AssignmentOrderStatus, InvoiceStatus } from './enums'
import type { Address } from './address.types'

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
// API của t đừng xó nha

export interface OrderProduct {
  product_id: string // Required
  sku: string // Required - Bắt đầu bằng "FRAME-" hoặc "LENS-"
  pricePerUnit: number // Required
}

export interface LensParameters {
  left: {
    SPH: number // Sphere
    CYL: number // Cylinder
    AXIS: number // Axis
    ADD?: number // Addition - OPTIONAL
  }
  right: {
    SPH: number
    CYL: number
    AXIS: number
    ADD?: number // OPTIONAL
  }
  PD: number // Pupillary Distance
}

export interface OrderLensDetail {
  lens_id: string // Required
  sku: string // Required
  parameters: LensParameters // Thông số kỹ thuật
  pricePerUnit: number // Required
}

export interface OrderProductItem {
  product: OrderProduct // REQUIRED - Frame hoặc Lens
  quantity: number // REQUIRED - Số lượng (min: 1)
  lens?: OrderLensDetail // OPTIONAL - Chỉ có khi Manufacturing Order
}

//----------------------------------------------------------------------
