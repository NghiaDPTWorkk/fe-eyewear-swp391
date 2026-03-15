import { ENDPOINTS, httpClient } from '@/api'

/**
 * Wishlist API - Low-level HTTP client for wishlist operations
 */
export const wishlistApi = {
  /**
   * Get all products in the user's wishlist
   */
  getWishlist: () => {
    return httpClient.get<{
      success: boolean
      message: string
      data: any
    }>(ENDPOINTS.WISHLIST.GET)
  },

  /**
   * Add a product to the wishlist
   * @param productId - The ID of the product to add
   */
  addToWishlist: (productId: string) => {
    return httpClient.post<{
      success: boolean
      message: string
    }>(ENDPOINTS.WISHLIST.ADD(productId), {})
  },

  /**
   * Remove a product from the wishlist
   * @param productId - The ID of the product to remove
   */
  removeFromWishlist: (productId: string) => {
    return httpClient.delete<{
      success: boolean
      message: string
    }>(ENDPOINTS.WISHLIST.REMOVE(productId))
  }
}
