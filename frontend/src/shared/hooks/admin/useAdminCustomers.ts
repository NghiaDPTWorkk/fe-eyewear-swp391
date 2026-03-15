import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { customerService } from '../../services/admin/customerService'
import type { AdminCustomerParams, AdminCustomerListResponse } from '../../types/customer.types'

export function useAdminCustomers(params: AdminCustomerParams) {
  return useQuery<AdminCustomerListResponse, Error>({
    queryKey: ['admin-customers', params],
    queryFn: () => customerService.getCustomers(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData
  })
}
