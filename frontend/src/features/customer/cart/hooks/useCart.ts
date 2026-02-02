import { useEffect } from 'react'
import { useCartStore } from '@/store'

/**
 * Hook để tự động fetch cart từ backend khi component mount
 * @returns Cart store state và actions
 */
export function useCart() {
  const store = useCartStore()

  useEffect(() => {
    // Fetch cart on mount
    store.fetchCart()
  }, []) // Empty dependency array - only run once on mount

  return store
}
