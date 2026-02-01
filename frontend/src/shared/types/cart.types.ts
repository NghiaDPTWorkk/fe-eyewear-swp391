import type { PrescriptionData } from './prescription.types'

export interface CartItem {
  product_id: string // SKU
  quantity: number
  name: string
  price: number
  image: string
  addAt: Date
  selected?: boolean
  lens?: {
    visionNeed: string
    prescription: PrescriptionData | null
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
  product_id: string // SKU
  quantity: number
}

export interface UpdateCartRequest {
  product_id: string // SKU
  quantity: number
}
