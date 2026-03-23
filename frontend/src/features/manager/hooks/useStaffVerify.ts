import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse, ReturnTicket } from '@/shared/types'

export function useStaffVerify() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await httpClient.patch<ApiResponse<ReturnTicket>>(
        ENDPOINTS.RETURN_TICKETS.STAFF_VERIFY(id),
        {}
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return-tickets'] })
      queryClient.invalidateQueries({ queryKey: ['my-return-history'] })
    }
  })
}
