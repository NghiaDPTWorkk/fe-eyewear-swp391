import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../../services/orderService'

/**
 * Hook để fetch orders với pagination và filter
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
 * Hook để lấy tất cả orders đã completed
 */
export const useCompletedOrders = () => {
  return useQuery({
    queryKey: ['orders', 'completed'],
    queryFn: () => orderService.getOrders(1, 1000, 'COMPLETED'),
    staleTime: 60000,
    refetchOnWindowFocus: true
  })
}

/**
 * Hook để lấy chi tiết một order
 * @param orderId - Order ID
 */
export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId, // Chỉ fetch khi có orderId
    staleTime: 30000
  })
}

/**
 * Hook search orders theo orderCode (dùng cho thanh search)
 * @param orderCode - Mã đơn hàng cần tìm
 */
export const useSearchOrders = (orderCode: string) => {
  return useQuery({
    queryKey: ['orders', 'search', orderCode],
    queryFn: () => orderService.searchByOrderCode(orderCode),
    enabled: orderCode.trim().length >= 2, // Chỉ gọi khi nhập >= 2 ký tự
    staleTime: 10000,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook lấy chi tiết invoice theo invoiceId
 * @param invoiceId - Invoice ID (lấy từ order.invoiceId)
 */
export const useInvoiceDetail = (invoiceId?: string) => {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => orderService.getInvoiceById(invoiceId!),
    enabled: !!invoiceId,
    staleTime: 60000,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook cập nhật trạng thái sang MAKING
 */
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

/**
 * Hook cập nhật trạng thái sang PACKAGING
 */
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

/**
 * Hook cập nhật trạng thái sang COMPLETED
 */
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

/**
 * Hook approve order với prescription parameters
 */
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
