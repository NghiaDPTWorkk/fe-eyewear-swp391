import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

interface UseGetProductWithPaginationReturn {
  products: Product[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useGetProductWithPagination = (
  page: number,
  limit: number
): UseGetProductWithPaginationReturn => {
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

      const apiResponse = await productService.getProducts(page, limit)

      if (apiResponse.success) {
        setProducts(apiResponse.data.data)
        setTotal(apiResponse.data.total)
        setTotalPages(apiResponse.data.totalPages)
        setCurrentPage(apiResponse.data.page)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

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
