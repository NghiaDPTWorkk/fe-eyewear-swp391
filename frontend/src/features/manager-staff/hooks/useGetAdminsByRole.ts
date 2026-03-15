import { useQuery } from '@tanstack/react-query'
import type { AdminAccountListApiResponse } from '@/shared/types'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'

export function useGetAdminsByRole(role?: string) {
  return useQuery<AdminAccountListApiResponse>({
    queryKey: ['admin-accounts', role],
    queryFn: () => adminAccountService.getAdmins(role),
    staleTime: 30_000
  })
}
