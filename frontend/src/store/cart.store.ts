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
  isInitialized: boolean
  addItem: (item: CartItem) => void
  addItemAsync: (
    productId: string,
    sku: string,
    quantity: number,
    lensSelection?: LensSelectionState
  ) => Promise<void>
  fetchCart: (force?: boolean, quiet?: boolean) => Promise<void>
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>
  removeItem: (item: CartItem) => Promise<void>
  removeItems: (items: CartItem[]) => Promise<void>
  toggleSelection: (item: CartItem) => void
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
  isInitialized: false,

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
      return { items: [{ ...item, selected: item.selected ?? true }, ...state.items] }
    }),

  /**
   * Async add item with API integration
   */
  addItemAsync: async (productId, sku, quantity, lensSelection) => {
    set({ isAddingToCart: true, addToCartError: null })

    try {
      // Call cart service
      const updatedItems = await cartService.addToCart(productId, sku, quantity, lensSelection)

      // Update cart state with backend response (preserving existing selections)
      const previousItems = get().items
      const mergedItems = updatedItems.map((ni) => {
        const matchingOld = previousItems.find(
          (oi) =>
            oi.product_id === ni.product_id &&
            (oi.sku || '') === (ni.sku || '') &&
            JSON.stringify(oi.lens) === JSON.stringify(ni.lens)
        )
        return { ...ni, selected: matchingOld ? (matchingOld.selected ?? true) : true }
      })

      set({ items: mergedItems, isAddingToCart: false })

      // If backend didn't return cart data (empty array), fetch cart to get latest state
      if (updatedItems.length === 0) {
        await get().fetchCart(true)
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
  fetchCart: async (force = false, quiet = false) => {
    // Optimization: Skip if already initialized and not a forced refresh
    // But ONLY if we actually have items. If items is empty, we likely need to fetch.
    if (get().isInitialized && !force && get().items.length > 0) {
      return
    }

    if (!quiet) set({ isLoading: true, fetchError: null })
    else set({ fetchError: null })

    try {
      const items = await cartService.getCart()
      // Preserve selection state if we already have items
      const previousItems = get().items
      const mergedItems = items.map((ni) => {
        const matchingOld = previousItems.find(
          (oi) =>
            oi.product_id === ni.product_id &&
            (oi.sku || '') === (ni.sku || '') &&
            JSON.stringify(oi.lens) === JSON.stringify(ni.lens)
        )
        return { ...ni, selected: matchingOld ? (matchingOld.selected ?? true) : true }
      })

      set({ items: mergedItems, isLoading: false, isInitialized: true })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch cart'
      set({
        isLoading: false,
        fetchError: errorMessage,
        items: [],
        isInitialized: true // Mark as initialized even on error to prevent infinite retries
      })
    }
  },

  updateQuantity: async (item, quantity) => {
    const previousItems = get().items
    set({
      isUpdating: true,
      items: previousItems.map((i) => {
        const isSameProduct = i.product_id === item.product_id
        const isSameSku = (i.sku || '') === (item.sku || '')
        const isSameLens = JSON.stringify(i.lens) === JSON.stringify(item.lens)
        return isSameProduct && isSameSku && isSameLens ? { ...i, quantity } : i
      })
    })

    try {
      const updatedItems = await cartService.updateQuantity(item, quantity)

      // Only update items if we got a valid non-empty list
      // Otherwise keep current items and do a quiet refresh
      if (updatedItems && updatedItems.length > 0) {
        // Preserve selection state
        const mergedItems = updatedItems.map((ni) => {
          const matchingOld = previousItems.find(
            (oi) =>
              oi.product_id === ni.product_id &&
              (oi.sku || '') === (ni.sku || '') &&
              JSON.stringify(oi.lens) === JSON.stringify(ni.lens)
          )
          return { ...ni, selected: matchingOld ? (matchingOld.selected ?? true) : true }
        })
        set({ items: mergedItems, isUpdating: false })
      } else {
        await get().fetchCart(true, true)
        set({ isUpdating: false })
      }
    } catch (error: any) {
      // Rollback on error
      set({ items: previousItems, isUpdating: false })
      throw error
    }
  },

  removeItem: async (item) => {
    set({ isRemoving: true })
    try {
      const updatedItems = await cartService.removeItem(item)
      // Preserve selection state for remaining items
      const previousItems = get().items
      const mergedItems = updatedItems.map((ni) => {
        const matchingOld = previousItems.find(
          (oi) =>
            oi.product_id === ni.product_id &&
            (oi.sku || '') === (ni.sku || '') &&
            JSON.stringify(oi.lens) === JSON.stringify(ni.lens)
        )
        return { ...ni, selected: matchingOld ? (matchingOld.selected ?? true) : true }
      })

      set({ items: mergedItems, isRemoving: false })

      if (updatedItems.length === 0) {
        await get().fetchCart(true)
      }
    } catch (error: any) {
      set({ isRemoving: false })
      throw error
    }
  },

  removeItems: async (itemsToRemove) => {
    set({ isRemoving: true })
    try {
      const updatedItems = await cartService.removeItems(itemsToRemove)
      // Preserve selection state for remaining items
      const previousItems = get().items
      const mergedItems = updatedItems.map((ni) => {
        const matchingOld = previousItems.find(
          (oi) =>
            oi.product_id === ni.product_id &&
            (oi.sku || '') === (ni.sku || '') &&
            JSON.stringify(oi.lens) === JSON.stringify(ni.lens)
        )
        return { ...ni, selected: matchingOld ? (matchingOld.selected ?? true) : true }
      })

      set({ items: mergedItems, isRemoving: false })
    } catch (error: any) {
      set({ isRemoving: false })
      throw error
    }
  },

  toggleSelection: (targetItem) =>
    set((state) => ({
      items: state.items.map((i) => {
        const isSameProduct = i.product_id === targetItem.product_id
        const isSameSku = (i.sku || '') === (targetItem.sku || '')
        const isSameLens = JSON.stringify(i.lens) === JSON.stringify(targetItem.lens)
        const isSameId = i._id && targetItem._id ? i._id === targetItem._id : true

        return isSameProduct && isSameSku && isSameLens && isSameId
          ? { ...i, selected: !i.selected }
          : i
      })
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
