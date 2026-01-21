export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CartSummary {
  totalItems: number
  totalPrice: number
  itemCount: number
}

export interface AddToCartRequest {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartRequest {
  quantity: number
}
