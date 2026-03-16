import { useQueries } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'
import type { AdminVoucherListResponse } from '@/shared/types'

const QK = 'manager-vouchers'

export function useVoucherStats() {
  const statuses = ['all', VoucherStatus.ACTIVE, VoucherStatus.DRAFT, VoucherStatus.DISABLE]

  const queries = useQueries({
    queries: statuses.map((status) => ({
      queryKey: [QK, 'stats', status],
      queryFn: () =>
        httpClient.get<AdminVoucherListResponse>(
          ENDPOINTS.MANAGER.VOUCHERS(1, 10, status === 'all' ? undefined : status)
        ),
      staleTime: 30_000
    }))
  })

  const stats: Record<string, number> = {}
  statuses.forEach((status, index) => {
    const res = queries[index].data
    const items = res?.data?.items
    const total =
      res?.pagination?.total ??
      res?.data?.pagination?.total ??
      (items && !Array.isArray(items) ? (items as any).pagination?.total : res?.data?.total) ??
      0
    stats[status] = total
  })

  return {
    stats,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError)
  }
}
