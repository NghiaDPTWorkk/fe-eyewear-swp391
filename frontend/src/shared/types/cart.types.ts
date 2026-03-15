import type { PrescriptionData } from './prescription.types'

export interface CartItem {
  _id?: string
  product_id: string
  quantity: number
  name: string
  price: number
  image: string
  addAt: Date
  selected?: boolean
  sku?: string
  mode?: 'AVAILABLE' | 'PRE_ORDER'
  lens?: {
    lensId?: string
    sku?: string
    visionNeed: string
    prescription: PrescriptionData | null
    name?: string
    price?: number
    image?: string
    nameVariant?: string
  }
  selectedOptions?: Record<string, string>
  productType?: string
  originalPrice?: number
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    label?: string
  }
}

export interface Cart {
  _id: string
  owner: string
  products: CartItem[]
  totalProduct: number
  createdAt: Date
  updatedAt: Date
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  itemCount: number
}

export interface AddToCartRequest {
  product_id: string
  quantity: number
}

export interface UpdateCartRequest {
  product_id: string
  quantity: number
}

import { type LensParameters } from './order-item.types'
export type { LensParameters }

export interface CartProductInfo {
  product_id: string
  sku: string
}

export interface CartLensInfo {
  lens_id: string
  sku: string
  parameters?: LensParameters
}

export interface CartItemPayload {
  product?: CartProductInfo
  lens?: CartLensInfo
}

export interface AddToCartPayload {
  item: CartItemPayload
  quantity: number
}

export interface BackendCartItem {
  _id: string
  product: {
    product_id: string
    sku: string
    name: string
    price: number
    image: string
  }
  lens?: {
    _id: string
    lens_id: string
    sku: string
    parameters?: LensParameters
  }
  quantity: number
  addedAt: string
}

export interface BackendCart {
  _id: string
  owner: string
  products: BackendCartItem[]
  totalProduct: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface GetCartResponse {
  success: boolean
  message: string
  data: {
    cart: BackendCart
  }
}

export interface AddToCartResponse {
  success: boolean
  message: string
  data: {
    cart: BackendCart
  }
}
