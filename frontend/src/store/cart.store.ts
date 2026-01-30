import type { CartItem } from '@/shared/types'
import { create } from 'zustand'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: CartItem) => void
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

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.product_id === item.product_id)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        }
      }
      return { items: [...state.items, { ...item, selected: item.selected ?? true }] }
    }),

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
