import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

interface UseGetProductDetailReturn {
  product: Product | null
  loading: boolean
  error: unknown
  refetch: () => void
}

export const useGetProductDetail = (id: string): UseGetProductDetailReturn => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)

  const fetchProduct = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const apiResponse = await productService.getProductDetail(id)

      if (apiResponse.success) {
        setProduct(apiResponse.data.product)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching product detail:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}
