import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/orderService'

/**
 * Hook để fetch orders với pagination và filter
 * @param page - Số trang
 * @param limit - Số lượng items mỗi trang
 * @param status - Filter theo status (optional)
 * @param type - Filter theo type (optional)
 */
export const useOrders = (page = 1, limit = 10, status?: string, type?: string) => {
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
    queryFn: () => orderService.getOrders(1, 10), // Lấy max 1000 orders
    staleTime: 60000, // Cache 1 phút
    refetchOnWindowFocus: true
  })
}
