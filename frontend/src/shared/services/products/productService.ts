import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { ProductResponse } from '@/shared/types/product.types'

export const productService = {
  getProducts(page: number, limit: number) {
    return httpClient.get<ApiResponse<ProductResponse>>(ENDPOINTS.PRODUCTS.COMMON_GET(page, limit))
  },
  getProductsByType(page: number, limit: number, type: string) {
    return httpClient.get<ApiResponse<ProductResponse>>(
      ENDPOINTS.PRODUCTS.COMMON_GET_BY_TYPE(page, limit, type)
    )
  }
}
