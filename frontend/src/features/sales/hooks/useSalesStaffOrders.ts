import { useState, useCallback } from 'react'
import { orderService } from '../services/orderService'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import type { Order } from '../types'

export const useSalesStaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapOrder = (o: any): Order => {
    let displayStatus = o.status
    if (o.status === OrderStatus.PENDING) displayStatus = 'WAITING_ASSIGN'
    else if ([OrderStatus.MAKING, OrderStatus.PACKAGING, OrderStatus.ASSIGNED].includes(o.status)) {
      displayStatus = 'PROCESSING'
    }

    return {
      ...o,
      id: o._id || o.id,
      status: displayStatus,
      rawStatus: o.status,
      isPrescription: o.type === OrderType.MANUFACTURING,
      orderType: o.type,
      invoice: o.invoice || (o.invoiceId ? { id: o.invoiceId, status: 'UNKNOWN' } : undefined),
      customerName: o.customerName || o.invoice?.fullName || 'Customer'
    }
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await orderService.getOrders()
      const data = (response as any).data || response
      setOrders((Array.isArray(data) ? data : []).map(mapOrder))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrderDetail = useCallback(async (orderId: string | number) => {
    setLoading(true)
    try {
      const response = await orderService.getOrderDetail(orderId)
      const detail = (response as any).data || response
      return { ...detail, id: detail._id || detail.id }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    orders,
    rxOrders: orders.filter((o) => o.isPrescription),
    pendingOrders: orders.filter((o) => o.isPrescription && o.status === 'WAITING_ASSIGN'),
    processedOrders: orders.filter((o) => !o.isPrescription || o.status !== 'WAITING_ASSIGN'),
    loading,
    error,
    fetchOrders,
    fetchOrderDetail
  }
}
