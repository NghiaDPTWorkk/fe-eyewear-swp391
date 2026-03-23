import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminProductDetailApiResponse } from '@/shared/types'

export function useAdminProductDetail(id: string) {
  return useQuery<AdminProductDetailApiResponse>({
    queryKey: ['admin-product-detail', id],
    queryFn: () =>
      httpClient.get<AdminProductDetailApiResponse>(ENDPOINTS.ADMIN.PRODUCT_DETAIL(id)),
    enabled: !!id,
    staleTime: 60_000
  })
}
