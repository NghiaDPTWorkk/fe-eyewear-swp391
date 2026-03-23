import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminProductListApiResponse } from '@/shared/types'

export function useAdminProducts(
  page?: number,
  limit?: number,
  type?: string,
  brand?: string,
  search?: string
) {
  return useQuery<AdminProductListApiResponse>({
    queryKey: ['admin-products', page, limit, type, brand, search],
    queryFn: () =>
      httpClient.get<AdminProductListApiResponse>(
        ENDPOINTS.ADMIN.PRODUCTS_LIST(page, limit, type, brand, search)
      ),
    staleTime: 30_000
  })
}
