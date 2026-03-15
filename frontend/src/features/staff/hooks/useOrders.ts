import { useQuery, useMutation } from '@tanstack/react-query'
import { orderService } from '../services/orderService'

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
    queryFn: () => orderService.getOrders(1, 50),
    staleTime: 60000,
    refetchOnWindowFocus: true
  })
}

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId
  })
}

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => orderService.updateOrder(id, data)
  })
}

export const useUpdateStatusToPackaging = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.updateStatusToPackaging(id)
  })
}

export const useUpdateStatusToCompleted = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.updateStatusToCompleted(id)
  })
}
