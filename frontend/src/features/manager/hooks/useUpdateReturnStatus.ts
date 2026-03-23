import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, ReturnTicket } from '@/shared/types'

export function useUpdateReturnStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await httpClient.patch<ApiResponse<ReturnTicket>>(
        ENDPOINTS.RETURN_TICKETS.UPDATE_STATUS(id, status),
        {}
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-return-history'] })
      queryClient.invalidateQueries({ queryKey: ['returned-orders'] })
    }
  })
}
