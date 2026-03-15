import { ENDPOINTS, httpClient } from '@/api'

export const wishlistApi = {
  getWishlist: () => {
    return httpClient.get<{
      success: boolean
      message: string
      data: any
    }>(ENDPOINTS.WISHLIST.GET)
  },

  addToWishlist: (productId: string) => {
    return httpClient.post<{
      success: boolean
      message: string
    }>(ENDPOINTS.WISHLIST.ADD(productId), {})
  },

  removeFromWishlist: (productId: string) => {
    return httpClient.delete<{
      success: boolean
      message: string
    }>(ENDPOINTS.WISHLIST.REMOVE(productId))
  }
}
