import { wishlistApi } from './wishlist.api'
import type { StandardProduct } from '@/shared/types/product.types'

/**
 * Wishlist Service - Business logic for wishlist operations
 */
export const wishlistService = {
  /**
   * Fetch user's wishlist
   */
  getWishlist: async (): Promise<StandardProduct[]> => {
    try {
      const response = await wishlistApi.getWishlist()

      if (response.success && response.data) {
        let products: any[] = []

        // Extract products array based on the provided JSON structure
        if (response.data.wishlist && Array.isArray(response.data.wishlist.products)) {
          products = response.data.wishlist.products
        } else if (response.data.products && Array.isArray(response.data.products)) {
          products = response.data.products
        } else if (Array.isArray(response.data)) {
          products = response.data
        } else if (response.data.wishlist && Array.isArray(response.data.wishlist)) {
          products = response.data.wishlist
        }

        // Map and flatten the data
        const mappedItems = products.map((item: any) => {
          // If the product is wrapped in productId (nested structure)
          const p = item.productId || item
          const defaultVariant = p.variants?.find((v: any) => v.isDefault) || p.variants?.[0]

          return {
            ...p,
            id: p._id || p.id,
            isDefault: item.isDefault || false,
            addedAt: item.createdAt || item.addedAt || p.createdAt,
            defaultVariantImage: p.defaultVariantImage || defaultVariant?.imgs?.[0] || '',
            defaultVariantPrice: p.defaultVariantPrice || defaultVariant?.price || 0,
            defaultVariantFinalPrice: p.defaultVariantFinalPrice || defaultVariant?.finalPrice || 0
          }
        })

        // Sort: Default first, then newest added first
        return mappedItems.sort((a, b) => {
          // Default priority
          if (a.isDefault && !b.isDefault) return -1
          if (!a.isDefault && b.isDefault) return 1

          // Newest next
          const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0
          const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0
          return dateB - dateA
        })
      }
      return []
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      throw error
    }
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (productId: string): Promise<void> => {
    try {
      const response = await wishlistApi.addToWishlist(productId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      throw error
    }
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (productId: string): Promise<void> => {
    try {
      const response = await wishlistApi.removeFromWishlist(productId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      throw error
    }
  }
}
