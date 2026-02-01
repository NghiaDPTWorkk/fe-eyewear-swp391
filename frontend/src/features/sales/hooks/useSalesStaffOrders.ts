import { useState, useCallback } from 'react'
import type { Order } from '../types'
import { salesStaffService } from '../services/sales-staff.service'
import { mapApiOrderToFrontend, filterOrdersByStatus } from '../utils/order.utils'

/**
 * Hook for managing Sales Staff orders
 */
export const useSalesStaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rawData = await salesStaffService.getOrders()
      const mappedOrders = (Array.isArray(rawData) ? rawData : []).map(mapApiOrderToFrontend)
      setOrders(mappedOrders)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrderDetail = useCallback(async (orderId: string | number) => {
    setLoading(true)
    try {
      const data = await salesStaffService.getOrderDetail(orderId)
      return mapApiOrderToFrontend(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const { rxOrders, pendingOrders, processedOrders } = filterOrdersByStatus(orders)

  return {
    orders,
    rxOrders,
    pendingOrders,
    processedOrders,
    loading,
    error,
    fetchOrders,
    fetchOrderDetail
  }
}
