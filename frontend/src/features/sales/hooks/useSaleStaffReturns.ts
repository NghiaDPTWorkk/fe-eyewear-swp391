import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { returnService } from '../services/returnService'
import { showSuccess, showError } from '../utils/errorHandler'

export function useSaleStaffReturns(
  params: {
    page?: number
    limit?: number
    status?: string
    search?: string
  } = {}
) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['sales', 'returns', params],
    queryFn: () => returnService.getReturnTickets(params),
    staleTime: 30000
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
      returnService.updateReturnTicketStatus(id, status),
    onSuccess: (response) => {
      showSuccess(response.message || 'Status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['sales', 'returns'] })
    },
    onError: (error: any) => {
      showError(error)
    }
  })

  return {
    returns: query.data?.data?.returnTicketList || [],
    pagination: query.data?.data?.pagination || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending
  }
}

export function useReturnTicketDetail(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['sales', 'return-detail', id],
    queryFn: () => returnService.getReturnTicketDetail(id),
    enabled: !!id && enabled,
    select: (res) => res.data
  })
}
