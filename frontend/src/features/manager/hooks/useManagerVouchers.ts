import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminVoucherListResponse } from '@/shared/types'

export function useManagerVouchers(page: number = 1, limit: number = 10, status?: string) {
  return useQuery<AdminVoucherListResponse>({
    queryKey: ['manager-vouchers', page, limit, status],
    queryFn: () =>
      httpClient.get<AdminVoucherListResponse>(ENDPOINTS.MANAGER.VOUCHERS(page, limit, status)),
    staleTime: 30_000
  })
}
