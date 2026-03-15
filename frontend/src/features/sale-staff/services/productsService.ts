import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ProductDetailApiResponse } from '@/shared/types'

export const productsService = {
  getProductDetail: async (productId: string) => {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.DETAIL(productId))
  }
}
