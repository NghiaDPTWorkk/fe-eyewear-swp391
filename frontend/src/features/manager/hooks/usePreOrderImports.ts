import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { PreOrderImportListApiResponse } from '@/shared/types'

export function usePreOrderImports(page: number = 1, limit: number = 10) {
  return useQuery<PreOrderImportListApiResponse>({
    queryKey: ['pre-order-imports', page, limit],
    queryFn: () =>
      httpClient.get<PreOrderImportListApiResponse>(ENDPOINTS.ADMIN.PRE_ORDER_IMPORTS(page, limit)),
    staleTime: 30_000
  })
}
