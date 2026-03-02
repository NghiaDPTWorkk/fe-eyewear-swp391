import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ProductDetailApiResponse, Product, Variant } from '@/shared/types'

// Response type based on test.ts
export interface ProductVariantResponse {
  success: boolean
  message: string
  data: {
    productDetail: Product
    variantDetail: Variant
  }
}

export const productsService = {
  /**
   * Lấy chi tiết một product
   * @param productId - Product ID
   */
  getProductDetail: async (productId: string) => {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.DETAIL(productId))
  },

  /**
   * Lấy chi tiết variant của product
   * @param productId - Product ID
   * @param sku - Variant SKU
   */
  getProductVariant: async (productId: string, sku: string) => {
    return httpClient.get<ProductVariantResponse>(ENDPOINTS.PRODUCTS.VARIANT(productId, sku))
  }
}
