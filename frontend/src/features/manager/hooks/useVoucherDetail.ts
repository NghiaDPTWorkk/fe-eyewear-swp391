import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { VoucherDetailResponse } from '@/shared/types'

const QK = 'manager-vouchers'

export function useVoucherDetail(id: string | null) {
  return useQuery<VoucherDetailResponse>({
    queryKey: [QK, 'detail', id],
    queryFn: () => httpClient.get<VoucherDetailResponse>(ENDPOINTS.MANAGER.VOUCHER_DETAIL(id!)),
    enabled: !!id,
    staleTime: 0
  })
}
