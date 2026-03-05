import { create } from 'zustand'
import { wishlistService } from '@/features/customer/wishlist/services/wishlist.service'
import type { StandardProduct } from '@/shared/types/product.types'

interface WishlistState {
  items: StandardProduct[]
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  fetchWishlist: (force?: boolean) => Promise<void>
  toggleWishlist: (product: StandardProduct) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  fetchWishlist: async (force = false) => {
    if (get().isInitialized && !force) return

    set({ isLoading: true, error: null })
    try {
      const items = await wishlistService.getWishlist()
      set({ items: Array.isArray(items) ? items : [], isLoading: false, isInitialized: true })
    } catch (error) {
      set({
        isLoading: false,
        error: (error as Error).message || 'Failed to fetch wishlist',
        isInitialized: true
      })
    }
  },

  toggleWishlist: async (product) => {
    const productId = product._id || product.id
    if (!productId) return

    const { items } = get()
    const isExist = items.some((item) => (item._id || item.id) === productId)

    try {
      if (isExist) {
        // Optimistic update
        set({ items: items.filter((item) => (item._id || item.id) !== productId) })
        await wishlistService.removeFromWishlist(productId)
      } else {
        // Optimistic update - Default first, then new item
        const defaultIndex = items.findIndex((item) => item.isDefault)
        let newItems: StandardProduct[]

        if (defaultIndex !== -1) {
          newItems = [
            ...items.slice(0, defaultIndex + 1),
            product,
            ...items.slice(defaultIndex + 1)
          ]
        } else {
          newItems = [product, ...items]
        }

        set({ items: newItems })
        await wishlistService.addToWishlist(productId)
      }
    } catch (error) {
      // Rollback on error
      set({ items })
      console.error('Wishlist toggle failed:', error)
      throw error
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((item) => (item._id || item.id) === productId)
  },

  clearWishlist: () => {
    set({ items: [], isInitialized: false, error: null })
  }
}))
