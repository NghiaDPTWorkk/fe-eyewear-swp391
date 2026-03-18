// END NEW CODE

import { useQueries } from '@tanstack/react-query'
import { productsService } from '../../services/products.service'

/**
 * Hook để lấy chi tiết nhiều products (batch fetch)
 * @param productIds - Array of product IDs
 */
export const useProductDetails = (productIds: string[]) => {
  return useQueries({
    queries: productIds.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => productsService.getProductDetail(id),
      staleTime: 60000
    }))
  })
}
