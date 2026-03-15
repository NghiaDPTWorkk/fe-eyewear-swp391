/**
 * Types for Operation Orders API
 * Matches the backend /orders endpoint response structure
 */

export interface LensParameters {
  left: {
    SPH: number
    CYL: number
    AXIS: number
    ADD?: number
  }
  right: {
    SPH: number
    CYL: number
    AXIS: number
    ADD?: number
  }
  PD: number
}

export interface Lens {
  parameters: LensParameters
  lens_id: string
  sku: string
  pricePerUnit: number
}

export interface ProductInOrder {
  product: {
    product_id: string
    sku: string
    pricePerUnit: number
  }
  quantity: number
  lens?: Lens
  _id: string
}

export interface OperationOrder {
  _id: string
  orderCode: string
  invoiceId: string
  type: string[] // ["MANUFACTURING", "PRESCRIPTION", etc.]
  status: string // "ASSIGNED", "PENDING", "COMPLETED", etc.
  products: ProductInOrder[]
  assignerStaff?: string
  assignedStaff?: string
  assignedAt?: string
  startedAt?: string | null
  completedAt?: string | null
  price: number
  deletedAt?: string | null
  __v: number
  createdAt: string
  updatedAt: string
}

export interface OrdersData {
  data: OperationOrder[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OrdersResponse {
  success: boolean
  message: string
  data: {
    orders: OrdersData
  }
}
