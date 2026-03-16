import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { AdminVoucherListResponse } from '@/shared/types'

const QK = 'manager-vouchers'

export function useSearchVouchersByCode(code: string) {
  return useQuery<AdminVoucherListResponse>({
    queryKey: [QK, 'search', code],
    queryFn: () =>
      httpClient.get<AdminVoucherListResponse>(
        `${ENDPOINTS.MANAGER.VOUCHERS(1, 20)}&code=${encodeURIComponent(code)}`
      ),
    enabled: code.trim().length >= 2,
    staleTime: 10_000
  })
}
