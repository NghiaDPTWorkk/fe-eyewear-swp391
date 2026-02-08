import { useQuery, useMutation } from '@tanstack/react-query'
import { orderService } from '../services/orders.service'

/**
 * Hook để lấy danh sách orders với phân trang và filter
 * @param page - Số trang
 * @param limit - Số lượng items mỗi trang
 * @param status - Filter theo status (optional)
 * @param type - Filter theo type (optional)
 */
export const useOrders = (page = 1, limit = 50, status?: string, type?: string) => {
  return useQuery({
    queryKey: ['orders', page, limit, status, type],
    queryFn: () => orderService.getOrders(page, limit, status, type),
    staleTime: 30000, // Cache 30 giây
    refetchOnWindowFocus: true // Refetch khi user quay lại tab
  })
}

/**
 * Hook để lấy tất cả orders (không phân trang) cho sidebar counts
 * Sử dụng limit lớn để lấy tất cả orders
 */
export const useAllOrders = () => {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orderService.getOrders(1, 1000), // Lấy max 1000 orders
    staleTime: 60000, // Cache 1 phút
    refetchOnWindowFocus: true
  })
}

/**
 * Hook để lấy orders có status COMPLETED
 * Dùng riêng cho sidebar count của Complete Orders
 */
export const useCompletedOrders = () => {
  return useQuery({
    queryKey: ['orders', 'completed'],
    queryFn: () => orderService.getOrders(1, 1000, 'COMPLETED'),
    staleTime: 60000, // Cache 1 phút
    refetchOnWindowFocus: true
  })
}

/**
 * Hook để lấy chi tiết một order theo ID
 * @param orderId - ID của order cần lấy
 */
export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId // Chỉ fetch khi có orderId
  })
}

/**
 * Hook để update order status
 * @returns mutation object
 */
export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => orderService.updateOrder(id, data)
  })
}

/**
 * Hook để update order status sang MAKING
 */
export const useUpdateStatusToMaking = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.updateStatusToMaking(id)
  })
}

/**
 * Hook để update order status sang PACKAGING
 */
export const useUpdateStatusToPackaging = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.updateStatusToPackaging(id)
  })
}

/**
 * Hook để update order status sang COMPLETED
 */
export const useUpdateStatusToCompleted = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.updateStatusToCompleted(id)
  })
}
