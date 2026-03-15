import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiResponse,
  RevenueStats,
  ReturnTicketListResponse,
  ReturnTicket,
  ReturnedOrdersResponse
} from '@/shared/types'

export function useRevenueStats(params: {
  period?: string
  fromDate?: string
  toDate?: string
  userId?: string
}) {
  return useQuery({
    queryKey: ['revenue-stats', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<RevenueStats>>(
        ENDPOINTS.REPORTS.REVENUE(params.period, params.fromDate, params.toDate, params.userId)
      )
      return res.data
    }
  })
}

export function useReturnTickets(params: {
  page?: number
  limit?: number
  status?: string
  orderId?: string
  customerId?: string
  staffVerify?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['return-tickets', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnTicketListResponse>>(
        ENDPOINTS.RETURN_TICKETS.ADMIN_LIST(params)
      )
      return res.data
    }
  })
}

export function useMyReturnHistory(params: {
  page?: number
  limit?: number
  status?: string
  orderId?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['my-return-history', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnTicketListResponse>>(
        `/admin/return-tickets/my-history?${new URLSearchParams(params as any).toString()}`
      )
      return res.data
    }
  })
}

export function useReturnedOrders(params: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['returned-orders', params],
    queryFn: async () => {
      const res = await httpClient.get<ApiResponse<ReturnedOrdersResponse>>(
        ENDPOINTS.RETURN_TICKETS.RETURNED_ORDERS(params.page, params.limit, params.search)
      )
      return res.data
    }
  })
}

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
