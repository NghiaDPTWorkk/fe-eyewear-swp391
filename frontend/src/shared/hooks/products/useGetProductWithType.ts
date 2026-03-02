import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

interface UseGetProductWithTypeReturn {
  products: Product[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useGetProductWithType = (
  page: number,
  limit: number,
  type: string
): UseGetProductWithTypeReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(page)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const apiResponse = await productService.getProductsByType(page, limit, type)

      if (apiResponse.success) {
        const productData = apiResponse.data
        setProducts(productData.productList || [])
        setTotal(productData.pagination?.total || 0)
        setTotalPages(productData.pagination?.totalPages || 0)
        setCurrentPage(productData.pagination?.page || page)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching products by type:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, type])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch: fetchProducts
  }
}
