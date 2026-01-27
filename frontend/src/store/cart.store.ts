import type { CartItem } from '@/shared/types'
import { create } from 'zustand'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  setLoading: (loading: boolean) => void
  totalItems: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item]
    })),

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

  clearCart: () => set({ items: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
}))
