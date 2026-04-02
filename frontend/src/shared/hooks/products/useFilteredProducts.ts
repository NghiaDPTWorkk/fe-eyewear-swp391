import { useCallback, useEffect, useState } from 'react'
import { productService } from '@/shared/services/products/productService'
import type { Product } from '@/shared/types/product.types'

export interface ProductFilterParams {
  page: number
  limit: number
  type?: string
  search?: string
  brand?: string[]
  material?: string[]
  shape?: string[]
  style?: string[]
  gender?: string[]
  categories?: string[]
  minPrice?: number
  maxPrice?: number
}

interface UseFilteredProductsReturn {
  products: Product[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useFilteredProducts = (filters: ProductFilterParams): UseFilteredProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(filters.page)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build params object — only include non-empty values
      const params: Record<string, string | number | string[] | undefined> = {
        page: filters.page,
        limit: filters.limit
      }

      if (filters.type) params.type = filters.type
      if (filters.search) params.search = filters.search
      if (filters.brand && filters.brand.length > 0) params.brand = filters.brand
      if (filters.material && filters.material.length > 0) params.material = filters.material
      if (filters.shape && filters.shape.length > 0) params.shape = filters.shape
      if (filters.style && filters.style.length > 0) params.style = filters.style
      if (filters.gender && filters.gender.length > 0) params.gender = filters.gender
      if (filters.categories && filters.categories.length > 0) {
        params.category = filters.categories
      }
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice

      const apiResponse = await productService.filterProducts(params)

      if (apiResponse.success) {
        const productData = apiResponse.data
        setProducts(productData.productList || [])
        setTotal(productData.pagination?.total || 0)
        setTotalPages(productData.pagination?.totalPages || 0)
        setCurrentPage(productData.pagination?.page || filters.page)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching filtered products:', err)
    } finally {
      setLoading(false)
    }
  }, [
    filters.page,
    filters.limit,
    filters.type,
    filters.search,
    filters.brand,
    filters.material,
    filters.shape,
    filters.style,
    filters.gender,
    filters.categories,
    filters.minPrice,
    filters.maxPrice
  ])

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
