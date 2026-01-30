import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { ProductResponse } from '@/shared/types/product.types'

export const productService = {
  getProducts(page: number, limit: number) {
    return httpClient.get<ApiResponse<ProductResponse>>(ENDPOINTS.PRODUCTS.COMMON_GET(page, limit))
  }
}
