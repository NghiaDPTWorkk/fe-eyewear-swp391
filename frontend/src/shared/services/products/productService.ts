import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { ProductListData, ProductDetailApiResponse } from '@/shared/types/product.types'
import type { ProductSpecs } from '@/shared/types/productSpecs.types'

export const productService = {
  getProducts(page: number, limit: number) {
    return httpClient.get<ApiResponse<ProductListData>>(ENDPOINTS.PRODUCTS.COMMON_GET(page, limit))
  },

  searchProducts(page: number, limit: number, search: string) {
    return httpClient.get<ApiResponse<ProductListData>>(
      ENDPOINTS.PRODUCTS.SEARCH(page, limit, search)
    )
  },

  getProductsByType(page: number, limit: number, type: string) {
    return httpClient.get<ApiResponse<ProductListData>>(
      ENDPOINTS.PRODUCTS.COMMON_GET_BY_TYPE(page, limit, type)
    )
  },

  getProductDetail(id: string) {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.DETAIL(id))
  },

  getProductSpecs() {
    return httpClient.get<ApiResponse<ProductSpecs>>(ENDPOINTS.PRODUCTS.SPECS)
  },

  filterProducts(params: Record<string, string | number | string[] | undefined>) {
    return httpClient.get<ApiResponse<ProductListData>>(ENDPOINTS.PRODUCTS.FILTER(params))
  },

  searchProductBySKU(sku: string) {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.SEARCH_BY_SKU(sku))
  }
}
