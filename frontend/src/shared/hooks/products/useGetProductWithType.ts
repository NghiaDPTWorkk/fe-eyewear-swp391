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

/**
 * Custom hook to fetch products filtered by type with pagination
 * @param page - Current page number
 * @param limit - Number of items per page
 * @param type - Product type filter (e.g., 'sunglass', 'eyeglass')
 * @returns Products data, loading state, error, pagination info, and refetch function
 */
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
        // Backend returns data.productList, not data.data
        const productData = apiResponse.data as any
        setProducts(productData.productList || [])
        setTotal(productData.total || 0)
        setTotalPages(productData.totalPages || 0)
        setCurrentPage(productData.page || page)
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
