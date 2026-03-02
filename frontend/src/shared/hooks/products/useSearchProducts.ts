import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

interface UseSearchProductsReturn {
  products: Product[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useSearchProducts = (
  page: number,
  limit: number,
  search: string
): UseSearchProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(page)

  const fetchProducts = useCallback(async () => {
    if (!search.trim()) {
      setProducts([])
      setTotal(0)
      setTotalPages(0)
      setCurrentPage(1)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const apiResponse = await productService.searchProducts(page, limit, search)

      if (apiResponse.success) {
        const productData = apiResponse.data
        setProducts(productData.productList || [])
        setTotal(productData.pagination?.total || 0)
        setTotalPages(productData.pagination?.totalPages || 0)
        setCurrentPage(productData.pagination?.page || page)
      }
    } catch (err) {
      setError(err)
      console.error('Error searching products:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

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
