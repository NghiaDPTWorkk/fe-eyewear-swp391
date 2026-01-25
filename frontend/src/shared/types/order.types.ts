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

export interface OrderProduct {
  product: {
    _id: string
    sku: string
    name: string
    price: number
    finalPrice: number
    img: string
  }
  lens?: {
    _id: string
    sku: string
    name: string
    price: number
    finalPrice: number
    img: string
    parameters: LensParameters
  }
  quantity: number
}

export interface Order {
  _id: string
  owner: string
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
  note?: string
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

export interface CreateOrderRequest {
  products: {
    product_id: string
    quantity: number
    lens?: {
      lens_id: string
      parameters: LensParameters
      quantity: number
    }
  }[]
  shippingAddress: Address
  customerInfo: {
    fullName: string
    phone: string
  }
  voucher?: string[]
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'ZALAPAY'
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
