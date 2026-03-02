import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { ProductSpecs } from '@/shared/types/productSpecs.types'

interface UseProductSpecsReturn {
  specs: ProductSpecs | null
  loading: boolean
  error: unknown
}

export const useProductSpecs = (): UseProductSpecsReturn => {
  const [specs, setSpecs] = useState<ProductSpecs | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)

  const fetchSpecs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const apiResponse = await productService.getProductSpecs()

      if (apiResponse.success) {
        setSpecs(apiResponse.data)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching product specs:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSpecs()
  }, [fetchSpecs])

  return {
    specs,
    loading,
    error
  }
}
