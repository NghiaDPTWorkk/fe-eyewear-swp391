import type { CartItem } from '@/shared/types'
import { create } from 'zustand'
import { cartService } from '@/features/customer/cart/services/cart.service'
import type { LensSelectionState } from '@/components/layout/customer/product-detail/lenses/types'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  isAddingToCart: boolean
  isUpdating: boolean
  isRemoving: boolean
  isClearing: boolean
  addToCartError: string | null
  fetchError: string | null
  addItem: (item: CartItem) => void
  addItemAsync: (
    productId: string,
    sku: string,
    quantity: number,
    lensSelection?: LensSelectionState
  ) => Promise<void>
  fetchCart: () => Promise<void>
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>
  removeItem: (item: CartItem) => Promise<void>
  toggleSelection: (productId: string) => void
  toggleAllSelection: () => void
  clearCart: () => Promise<void>
  setLoading: (loading: boolean) => void
  totalItems: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  isAddingToCart: false,
  isUpdating: false,
  isRemoving: false,
  isClearing: false,
  addToCartError: null,
  fetchError: null,

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
    set({ isAddingToCart: true, addToCartError: null })

    try {
      // Call cart service
      const updatedItems = await cartService.addToCart(productId, sku, quantity, lensSelection)

      // Update cart state with backend response
      set({ items: updatedItems, isAddingToCart: false })

      // If backend didn't return cart data (empty array), fetch cart to get latest state
      if (updatedItems.length === 0) {
        await get().fetchCart()
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to add item to cart'
      set({ isAddingToCart: false, addToCartError: errorMessage })

      // Re-throw for component-level handling
      throw error
    }
  },

  /**
   * Fetch cart from backend
   */
  fetchCart: async () => {
    set({ isLoading: true, fetchError: null })

    try {
      // Call cart service to get cart items

      // Call cart service to get cart items
      const items = await cartService.getCart()

      // Update cart state with backend response
      set({ items, isLoading: false })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch cart'
      set({ isLoading: false, fetchError: errorMessage, items: [] })

      // Don't re-throw, just set error state
      // This allows the UI to handle the error gracefully
    }
  },

  updateQuantity: async (item, quantity) => {
    set({ isUpdating: true })
    try {
      const updatedItems = await cartService.updateQuantity(item, quantity)
      set({ items: updatedItems, isUpdating: false })
    } catch (error: any) {
      set({ isUpdating: false })
      throw error
    }
  },

  removeItem: async (item) => {
    set({ isRemoving: true })
    try {
      const updatedItems = await cartService.removeItem(item)
      set({ items: updatedItems, isRemoving: false })
    } catch (error: any) {
      set({ isRemoving: false })
      throw error
    }
  },

  toggleSelection: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product_id === productId ? { ...item, Selected: !item.Selected } : item
      )
    })),

  toggleAllSelection: () =>
    set((state) => {
      const allSelected = state.items.every((item) => item.selected)
      return {
        items: state.items.map((item) => ({ ...item, selected: !allSelected }))
      }
    }),

  clearCart: async () => {
    set({ isClearing: true })
    try {
      await cartService.clearCart()
      set({ items: [], isClearing: false })
    } catch (error: any) {
      set({ isClearing: false })
      throw error
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}))
