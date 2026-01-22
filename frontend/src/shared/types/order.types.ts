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

export interface OrderItem {
  product_id: string
  sku: string
  quantity: number
  lens?: {
    lens_id: string
    parameters: LensParameters
    quantity: number
  }
}

export interface ShippingAddress {
  no: string
  ward: string
  city: string
}

export interface CustomerInfo {
  fullName: string
  phone: string
}

export interface PaymentDetails {
  totalPrice: number
  totalDiscount: number
  finalPrice: number
  voucher: string[]
}

export interface VerificationStatus {
  status: 'PENDING' | 'APPROVE' | 'REJECT'
  staffVerified?: string
}

export interface Assignment {
  staffId?: string
  assignStaff?: string
  assignedAt?: string
  startedAt?: string
  completedAt?: string
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface Order {
  _id: string
  owner: string
  type: 'NORMAL' | 'PRE-ORDER' | 'MANUFACTURING'
  products: OrderItem[]
  shippingAddress: ShippingAddress
  customerInfo: CustomerInfo
  payment: PaymentDetails
  isVerified?: VerificationStatus
  assignment?: Assignment
  note?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export interface CreateOrderRequest {
  products: OrderItem[]
  shippingAddress: ShippingAddress
  customerInfo: CustomerInfo
  voucher?: string[]
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO'
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
