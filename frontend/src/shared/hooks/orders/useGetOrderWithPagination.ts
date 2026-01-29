import { useCallback, useEffect, useState } from 'react'
import { orderService } from '@/shared/services/order/orderService'
import type { Order } from '@/shared/types/order.types'

interface UseGetOrderWithPaginationReturn {
  orders: Order[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useGetOrderWithPagination = (
  page: number,
  limit: number
): UseGetOrderWithPaginationReturn => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown>(null)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(page)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const apiResponse = await orderService.getOrders(page, limit)

      if (apiResponse.success) {
        const orderData = apiResponse.data
        // Handle potential different response structures if needed, similar to products
        setOrders(orderData.items || [])
        setTotal(orderData.pagination?.total || 0)
        setTotalPages(orderData.pagination?.totalPages || 0)
        setCurrentPage(orderData.pagination?.page || page)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch: fetchOrders
  }
}
