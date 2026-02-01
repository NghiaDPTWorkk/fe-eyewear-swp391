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
    console.log(payload)

    return httpClient.post<AddToCartResponse>(ENDPOINTS.CART.ADD, payload)
  }
}
