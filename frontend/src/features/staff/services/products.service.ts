import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ProductDetailApiResponse, Product, Variant } from '@/shared/types'

export interface ProductVariantResponse {
  success: boolean
  message: string
  data: {
    productDetail: Product
    variantDetail: Variant
  }
}

export const productsService = {
  getProductDetail: async (productId: string) => {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.DETAIL(productId))
  },

  getProductVariant: async (productId: string, sku: string) => {
    return httpClient.get<ProductVariantResponse>(ENDPOINTS.PRODUCTS.VARIANT(productId, sku))
  }
}
