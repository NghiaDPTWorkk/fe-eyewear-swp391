import { ENDPOINTS, httpClient } from '@/api'
import type { AddToCartPayload, AddToCartResponse } from '@/shared/types/cart.types'

/**
 * Cart API - Low-level HTTP client for cart operations
 */
export const cartApi = {
  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param payload - Thông tin sản phẩm và số lượng
   * @returns Giỏ hàng đã cập nhật
   */
  addProductToCart: (payload: AddToCartPayload) => {
    return httpClient.post<AddToCartResponse>(ENDPOINTS.CART.ADD, payload)
  },

  /**
   * Lấy giỏ hàng hiện tại
   */
  getCart: () => {
    return httpClient.get<AddToCartResponse>(ENDPOINTS.CART.GET)
  },

  /**
   * Cập nhật số lượng cart item
   */
  updateQuantity: (payload: AddToCartPayload) => {
    return httpClient.patch<AddToCartResponse>(ENDPOINTS.CART.UPDATE_QUANTITY, payload)
  },

  /**
   * Xóa item khỏi giỏ hàng
   */
  removeItem: (payload: AddToCartPayload) => {
    return httpClient.delete<AddToCartResponse>(ENDPOINTS.CART.REMOVE_ITEM, { data: payload })
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: () => {
    return httpClient.delete<AddToCartResponse>(ENDPOINTS.CART.CLEAR)
  }
}
