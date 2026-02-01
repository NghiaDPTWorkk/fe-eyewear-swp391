import type { CartItem } from '@/shared/types'
import { create } from 'zustand'
import { cartService } from '@/features/customer/cart/services/cart.service'
import type { LensSelectionState } from '@/components/layout/customer/product-detail/lenses/types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  isAddingToCart: boolean
  addToCartError: string | null
  addItem: (item: CartItem) => void
  addItemAsync: (
    productId: string,
    sku: string,
    quantity: number,
    lensSelection?: LensSelectionState
  ) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  toggleSelection: (productId: string) => void
  toggleAllSelection: (selected: boolean) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  totalItems: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  isAddingToCart: false,
  addToCartError: null,

  /**
   * Local-only add item (backward compatibility)
   */
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => {
        const isSameProduct = i.product_id === item.product_id
        const isSameLens = JSON.stringify(i.lens) === JSON.stringify(item.lens)
        return isSameProduct && isSameLens
      })

      if (existingItem) {
        return {
          items: state.items.map((i) => {
            const isSameProduct = i.product_id === item.product_id
            const isSameLens = JSON.stringify(i.lens) === JSON.stringify(item.lens)
            return isSameProduct && isSameLens ? { ...i, quantity: i.quantity + item.quantity } : i
          })
        }
      }
      return { items: [...state.items, { ...item, selected: item.selected ?? true }] }
    }),

  /**
   * Async add item with API integration
   */
  addItemAsync: async (productId, sku, quantity, lensSelection) => {
    console.log('🏪 Cart Store: addItemAsync called with:', {
      productId,
      sku,
      quantity,
      lensSelection
    })

    set({ isAddingToCart: true, addToCartError: null })

    try {
      console.log('🏪 Cart Store: Calling cartService.addToCart')

      // Call cart service
      const updatedItems = await cartService.addToCart(productId, sku, quantity, lensSelection)

      console.log('🏪 Cart Store: Received updated items:', updatedItems)

      // Update cart state with backend response
      set({ items: updatedItems, isAddingToCart: false })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add item to cart'
      console.error('🏪 Cart Store: Error:', errorMessage)
      set({ isAddingToCart: false, addToCartError: errorMessage })

      // Re-throw for component-level handling
      throw error
    }
  },

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product_id !== productId)
    })),

  toggleSelection: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product_id === productId ? { ...item, selected: !item.selected } : item
      )
    })),

  toggleAllSelection: (selected) =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selected }))
    })),

  clearCart: () => set({ items: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}))
