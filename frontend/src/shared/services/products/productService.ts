import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { ProductListData } from '@/shared/types/product.types'

export const productService = {
  //get all product and pagination
  /**
   *
   * @param page so trang
   * @param limit item cua moi trang
   * @returns
   */
  getProducts(page: number, limit: number) {
    return httpClient.get<ApiResponse<ProductListData>>(ENDPOINTS.PRODUCTS.COMMON_GET(page, limit))
  },

  //search product
  /**
   *
   * @param page so trang
   * @param limit item cua moi trang
   * @param search tu khoa tim kiem
   * @returns
   */
  searchProducts(page: number, limit: number, search: string) {
    return httpClient.get<ApiResponse<ProductListData>>(
      ENDPOINTS.PRODUCTS.SEARCH(page, limit, search)
    )
  },

  getProductsByType(page: number, limit: number, type: string) {
    return httpClient.get<ApiResponse<ProductListData>>(
      ENDPOINTS.PRODUCTS.COMMON_GET_BY_TYPE(page, limit, type)
    )
  }
}
