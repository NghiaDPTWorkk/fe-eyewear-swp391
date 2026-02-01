export interface AdminOrderProductSkuRef {
  product_id: string
  sku: string
  pricePerUnit: number
}

export interface AdminOrderLensParametersSide {
  SPH: number
  CYL: number
  AXIS: number
}

export interface AdminOrderLensParameters {
  left: AdminOrderLensParametersSide
  right: AdminOrderLensParametersSide
  PD: number
}

export interface AdminOrderLensSkuRef {
  parameters: AdminOrderLensParameters
  lens_id: string
  sku: string
  pricePerUnit: number
}

export interface AdminOrderProductItem {
  product: AdminOrderProductSkuRef
  quantity: number
  lens: AdminOrderLensSkuRef
  _id: string
}

export interface AdminOrderDetail {
  _id: string
  orderCode: string
  invoiceId: string
  type: string[]
  status: string
  products: AdminOrderProductItem[]
  assignerStaff: string | null
  assignedStaff: string | null
  assignedAt: string | null
  startedAt: string | null
  completedAt: string | null
  price: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminOrderDetailApiResponse {
  success: boolean
  message: string
  data: {
    order: AdminOrderDetail
  }
}
