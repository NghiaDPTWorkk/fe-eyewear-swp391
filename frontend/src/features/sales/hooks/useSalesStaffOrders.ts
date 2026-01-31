import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import type { Order } from '../types'

export const useSalesStaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await httpClient.get<any>('/api/v1/orders')
      const data = response.data || []
      const deposited = Array.isArray(data)
        ? data.filter((o) => o.invoice?.status === 'DEPOSITED')
        : []
      setOrders(deposited)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrderDetail = useCallback(async (orderId: string | number) => {
    setLoading(true)
    try {
      const response = await httpClient.get<any>(`/api/v1/orders/${orderId}`)
      return response.data
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Classify for Prescription page
  const rxOrders = orders.filter(
    (o) => o.isPrescription && (o.status === 'WAITING_ASSIGN' || o.status === 'PROCESSING')
  )
  const pendingOrders = orders.filter((o) => o.isPrescription && o.status === 'WAITING_ASSIGN')
  const processedOrders = orders.filter((o) => !o.isPrescription || o.status !== 'WAITING_ASSIGN')

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
