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
                _id: ord.id,
                orderCode: ord.orderCode || inv.invoiceCode,
                invoiceId: inv.id,
                customerName: inv.fullName,
                customerPhone: inv.phone,
                createdAt: inv.createdAt,
                status: ord.status || inv.status,
                isPrescription: ord.type?.includes('MANUFACTURING') || false,
                price: Number(inv.finalPrice?.replace(/[^0-9]/g, '') || 0),
                products: ord.products || []
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
      const response = await httpClient.get<{ data: { order: OrderDetail } }>(
        `/admin/orders/${orderId}`
      )
      const orderData = response.data?.order
      return orderData || null
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
