import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import type { Order, OrderDetail } from '../types'
import { transformOrder } from '../utils/orderUtils'

export const useSalesStaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const response = await httpClient.get<any>('/admin/invoices/deposited')
      const invoices = response.data?.data || response.data || []
      const allOrders: Order[] = []

      if (Array.isArray(invoices)) {
        invoices.forEach((inv: any) => {
          if (Array.isArray(inv.orders)) {
            inv.orders.forEach((ord: any) => {
              allOrders.push(transformOrder(ord, inv))
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const response = await httpClient.get<any>(`/admin/orders/${orderId}`)
      const ord = response.data?.order || response.data?.data?.order || response.data || null

      if (!ord) return null

      // Try to fetch invoice data if we have invoiceId
      let invoiceData = null
      const invoiceId = ord.invoiceId || ord.invoice?._id
      if (invoiceId) {
        try {
          const invResponse = await httpClient.get<any>(`/admin/invoices/${invoiceId}`)
          invoiceData = invResponse.data?.invoice || invResponse.data?.data || invResponse.data
        } catch {
          // Invoice fetch failed, continue without it
        }
      }

      return transformOrder(ord, invoiceData) as OrderDetail
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order detail')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const rxOrders = orders.filter((o) => o.isPrescription)
  const pendingOrders = orders.filter(
    (o) => o.isPrescription && ['WAITING_ASSIGN', 'PENDING', 'DEPOSITED'].includes(o.status)
  )
  const processedOrders = orders.filter(
    (o) => !o.isPrescription || !['WAITING_ASSIGN', 'PENDING'].includes(o.status)
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
