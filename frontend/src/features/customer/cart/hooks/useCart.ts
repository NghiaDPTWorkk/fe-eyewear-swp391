import { useEffect } from 'react'
import { useCartStore } from '@/store'

export function useCart() {
  const store = useCartStore()

  useEffect(() => {
    store.fetchCart()
  }, [])

  return store
}
