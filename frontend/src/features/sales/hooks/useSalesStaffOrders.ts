import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import type { Order, OrderDetail } from '../types'

export const useSalesStaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await httpClient.get<any>('/admin/invoices/deposited')
      const invoices = response.data?.data || response.data || []
      const allOrders: Order[] = []

      if (Array.isArray(invoices)) {
        invoices.forEach((inv: any) => {
          if (Array.isArray(inv.orders)) {
            inv.orders.forEach((ord: any) => {
              allOrders.push({
                ...ord,
                _id: ord.id || ord._id,
                orderCode: ord.orderCode || inv.invoiceCode || `ORD-${ord.id || ord._id}`,
                invoiceId: inv.id || inv._id,
                customerName: inv.fullName || inv.customer?.fullName || 'Guest',
                customerPhone: inv.phone || inv.customer?.phone || '',
                createdAt: inv.createdAt,
                status: ord.status || 'DEPOSITED',
                isPrescription: ord.type?.includes('MANUFACTURING') || ord.isPrescription || false,
                products: ord.products || ord.orderItems || []
              })
            })
          }
        })
      }

      setOrders(allOrders)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOrderDetail = useCallback(async (orderId: string | number) => {
    setLoading(true)
    try {
      const response = await httpClient.get<{ data: { order: any } } | any>(
        `/admin/orders/${orderId}`
      )
      const ord = response.data?.order || response.data?.data?.order || response.data || null

      if (!ord) return null

      const transformed: OrderDetail = {
        ...ord,
        _id: ord._id || ord.id,
        orderCode: ord.orderCode || `ORD-${ord.id || ord._id}`,
        invoiceId: ord.invoiceId || ord.invoice?._id,
        customerName:
          ord.customerName || ord.invoice?.fullName || ord.invoice?.customer?.fullName || 'Guest',
        customerPhone:
          ord.customerPhone || ord.invoice?.phone || ord.invoice?.customer?.phone || '',
        createdAt: ord.createdAt,
        status: ord.status,
        isPrescription: ord.type?.includes('MANUFACTURING') || ord.isPrescription || false,
        products: ord.products || ord.orderItems || []
      }

      return transformed
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const rxOrders = orders.filter((o) => o.isPrescription)
  const pendingOrders = orders.filter(
    (o) =>
      o.isPrescription &&
      (o.status === 'WAITING_ASSIGN' || o.status === 'PENDING' || o.status === 'DEPOSITED')
  )
  const processedOrders = orders.filter(
    (o) => !o.isPrescription || (o.status !== 'WAITING_ASSIGN' && o.status !== 'PENDING')
  )

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
