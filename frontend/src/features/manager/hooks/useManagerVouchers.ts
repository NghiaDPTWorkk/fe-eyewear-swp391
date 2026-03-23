import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminVoucherListResponse } from '@/shared/types'

const QK = 'manager-vouchers'

export function useManagerVouchers(page = 1, limit = 10, status?: string, search?: string) {
  return useQuery<AdminVoucherListResponse>({
    queryKey: [QK, page, limit, status, search],
    queryFn: () =>
      httpClient.get<AdminVoucherListResponse>(
        ENDPOINTS.MANAGER.VOUCHERS(page, limit, status, search)
      ),
    staleTime: 30_000
  })
}
