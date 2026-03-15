import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../../services/orderService'

export const useOrders = (page = 1, limit = 50, status?: string, type?: string) => {
  return useQuery({
    queryKey: ['orders', page, limit, status, type],
    queryFn: () => orderService.getOrders(page, limit, status, type),
    staleTime: 30000,
    refetchOnWindowFocus: true
  })
}

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orderService.getOrders(1, 1000),
    staleTime: 60000,
    refetchOnWindowFocus: true
  })
}

export const useCompletedOrders = () => {
  return useQuery({
    queryKey: ['orders', 'completed'],
    queryFn: () => orderService.getOrders(1, 1000, 'COMPLETED'),
    staleTime: 60000,
    refetchOnWindowFocus: true
  })
}

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 30000
  })
}

export const useSearchOrders = (orderCode: string) => {
  return useQuery({
    queryKey: ['orders', 'search', orderCode],
    queryFn: () => orderService.searchByOrderCode(orderCode),
    enabled: orderCode.trim().length >= 2,
    staleTime: 10000,
    refetchOnWindowFocus: false
  })
}

export const useInvoiceDetail = (invoiceId?: string) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => orderService.getInvoiceById(invoiceId!),
    enabled: !!invoiceId,
    staleTime: 60000,
    refetchOnWindowFocus: false
  })
}

export const useUpdateStatusToMaking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => orderService.updateStatusToMaking(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  })
}

export const useUpdateStatusToPackaging = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => orderService.updateStatusToPackaging(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  })
}

export const useUpdateStatusToCompleted = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: string) => orderService.updateStatusToCompleted(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  })
}

export const useApproveOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: { parameters: any } }) =>
      orderService.approveOrder(orderId, data),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', orderId] })
    }
  })
}

export const useOrdersDetails = (orderIds: string[]) => {
  return useQueries({
    queries: (orderIds ?? []).map((id) => ({
      queryKey: ['order', id],
      queryFn: () => orderService.getOrderById(id),
      staleTime: 30000
    }))
  })
}
