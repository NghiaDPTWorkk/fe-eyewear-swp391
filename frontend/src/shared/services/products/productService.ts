import { ENDPOINTS, httpClient } from '@/api'
import type { ApiResponse } from '@/shared/types/response.types'
import type { ProductListData, ProductDetailApiResponse } from '@/shared/types/product.types'
import type { ProductSpecs } from '@/shared/types/productSpecs.types'

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

  //get product by category
  /**
   *
   * @param page so trang
   * @param limit item cua moi trang
   * @param category danh mục
   * @returns
   */
  getProductsByType(page: number, limit: number, type: string) {
    return httpClient.get<ApiResponse<ProductListData>>(
      ENDPOINTS.PRODUCTS.COMMON_GET_BY_TYPE(page, limit, type)
    )
  },

  //get product detail
  /**
   * @param id product id
   * @returns
   */
  getProductDetail(id: string) {
    return httpClient.get<ProductDetailApiResponse>(ENDPOINTS.PRODUCTS.DETAIL(id))
  },

  // get product specs for filters
  getProductSpecs() {
    return httpClient.get<ApiResponse<ProductSpecs>>(ENDPOINTS.PRODUCTS.SPECS)
  },

  // filter products by specs
  filterProducts(params: Record<string, string | number | string[] | undefined>) {
    return httpClient.get<ApiResponse<ProductListData>>(ENDPOINTS.PRODUCTS.FILTER(params))
  }
}
