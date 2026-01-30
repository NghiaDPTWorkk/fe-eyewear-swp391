import { useCallback, useEffect, useState } from 'react'
import { orderService } from '@/shared/services/order/orderService'
import type { Order } from '@/shared/types/order.types'

interface UseGetOrderWithTypeReturn {
  orders: Order[]
  loading: boolean
  error: unknown
  total: number
  totalPages: number
  currentPage: number
  refetch: () => void
}

export const useGetOrderWithType = (
  page: number,
  limit: number,
  type: string
): UseGetOrderWithTypeReturn => {
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

      // Check if we are filtering by type or status logic.
      // Based on previous conversations, 'Pre-order' and 'Prescription' seem to be Order Types.
      const apiResponse = await orderService.getOrdersByType(page, limit, type)

      if (apiResponse.success) {
        const orderData = apiResponse.data
        setOrders(orderData.items || [])
        setTotal(orderData.pagination?.total || 0)
        setTotalPages(orderData.pagination?.totalPages || 0)
        setCurrentPage(orderData.pagination?.page || page)
      }
    } catch (err) {
      setError(err)
      console.error('Error fetching orders by type:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, type])

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
