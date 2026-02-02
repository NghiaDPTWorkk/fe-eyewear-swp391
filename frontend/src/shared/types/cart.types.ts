import type { PrescriptionData } from './prescription.types'

export interface CartItem {
  product_id: string // SKU
  quantity: number
  name: string
  price: number
  image: string
  addAt: Date
  selected?: boolean
  sku?: string
  lens?: {
    lensId?: string // Backend lens_id for API
    sku?: string // Lens SKU for API
    visionNeed: string
    prescription: PrescriptionData | null
  }
  selectedOptions?: Record<string, string> // For display purposes
  productType?: string
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

// ============================================
// Backend API Types
// ============================================

/**
 * Lens parameters for prescription
 */
import { type LensParameters } from './order-item.types'
export type { LensParameters }

/**
 * Product info for add to cart
 */
export interface CartProductInfo {
  product_id: string
  sku: string
}

/**
 * Lens info for add to cart
 */
export interface CartLensInfo {
  lens_id: string
  sku: string
  parameters?: LensParameters
}

/**
 * Cart item structure for backend API
 */
export interface CartItemPayload {
  product?: CartProductInfo
  lens?: CartLensInfo
}

/**
 * Add to cart request payload matching backend API
 */
export interface AddToCartPayload {
  item: CartItemPayload
  quantity: number
}

/**
 * Backend cart item response (matches actual API structure)
 */
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
  addedAt: string // ISO date string from API
}

/**
 * Backend cart response (matches actual API structure)
 */
export interface BackendCart {
  _id: string
  owner: string
  products: BackendCartItem[] // Note: API uses 'products', not 'items'
  totalProduct: number // Note: API uses 'totalProduct', not 'totalItems'
  deletedAt: string | null
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  __v: number
}

/**
 * Get cart API response wrapper
 */
export interface GetCartResponse {
  success: boolean
  message: string
  data: {
    cart: BackendCart
  }
}

/**
 * Add to cart API response
 */
export interface AddToCartResponse {
  success: boolean
  message: string
  data: {
    cart: BackendCart
  }
}
