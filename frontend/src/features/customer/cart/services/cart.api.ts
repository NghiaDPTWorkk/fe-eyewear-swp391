import { ENDPOINTS, httpClient } from '@/api'
import type { AddToCartPayload, AddToCartResponse } from '@/shared/types/cart.types'

export const cartApi = {
  addProductToCart: (payload: AddToCartPayload) => {
    return httpClient.post<AddToCartResponse>(ENDPOINTS.CART.ADD, payload)
  },

  getCart: () => {
    return httpClient.get<AddToCartResponse>(ENDPOINTS.CART.GET)
  },

  updateQuantity: (payload: AddToCartPayload) => {
    return httpClient.patch<AddToCartResponse>(ENDPOINTS.CART.UPDATE_QUANTITY, payload)
  },

  removeItem: (payload: AddToCartPayload) => {
    return httpClient.delete<AddToCartResponse>(ENDPOINTS.CART.REMOVE_ITEM, { data: payload })
  },

  clearCart: () => {
    return httpClient.delete<AddToCartResponse>(ENDPOINTS.CART.CLEAR)
  }
}
