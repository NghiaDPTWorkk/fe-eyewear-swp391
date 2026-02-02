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
      const response = await httpClient.get<any>('/admin/orders')

      const rawData = response.data?.orders?.data || response.data?.data || []

      const mappedOrders: Order[] = (Array.isArray(rawData) ? rawData : []).map((o: any) => {
        let frontendStatus = o.status
        if (o.status === 'PENDING') frontendStatus = 'WAITING_ASSIGNED'
        else if (['MAKING', 'PACKAGING', 'ASSIGNED'].includes(o.status))
          frontendStatus = 'PROCESSING'
        else if (o.status === 'COMPLETE') frontendStatus = 'COMPLETED'

        return {
          ...o,
          id: o._id,
          status: frontendStatus,
          isPrescription: o.type?.includes('MANUFACTURING') || false,
          orderType: o.type,
          invoice: o.invoice || (o.invoiceId ? { id: o.invoiceId, status: 'UNKNOWN' } : undefined),
          customerName: o.customerName || o.invoice?.fullName || 'Customer'
        }
      })

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
      // Correct endpoint: /orders/:id (apiClient adds /api/v1)
      const response = await httpClient.get<any>(`/orders/${orderId}`)
      const data = response.data?.data || response.data
      return {
        ...data,
        id: data._id
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const rxOrders = orders.filter(
    (o) => o.isPrescription && (o.status === 'WAITING_ASSIGNED' || o.status === 'PROCESSING')
  )
  const pendingOrders = orders.filter((o) => o.isPrescription && o.status === 'WAITING_ASSIGNED')
  const processedOrders = orders.filter((o) => !o.isPrescription || o.status !== 'WAITING_ASSIGNED')

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
