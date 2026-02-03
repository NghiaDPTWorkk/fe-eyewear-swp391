import { useQuery, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import type { Order, OrderDetail } from '../types'
import { transformOrder } from '../utils/orderUtils'
import { useMemo } from 'react'

export const useSalesStaffOrders = () => {
  const queryClient = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: ['sales', 'orders'],
    queryFn: async ({ signal }) => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const response = await httpClient.get<any>('/admin/invoices/deposited', { signal })
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
      return allOrders
    },
    staleTime: 30000 // 30 seconds
  })

  const orders = useMemo(() => ordersQuery.data || [], [ordersQuery.data])

  const rxOrders = useMemo(() => orders.filter((o) => o.isPrescription), [orders])
  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.isPrescription && ['WAITING_ASSIGN', 'PENDING', 'DEPOSITED'].includes(o.status)
      ),
    [orders]
  )
  const processedOrders = useMemo(
    () =>
      orders.filter((o) => !o.isPrescription || !['WAITING_ASSIGN', 'PENDING'].includes(o.status)),
    [orders]
  )

  const fetchOrders = () => ordersQuery.refetch()

  // Manual fetch function for compatibility with existing components if needed
  const fetchOrderDetail = async (orderId: string | number) => {
    try {
      const response = await httpClient.get<any>(`/admin/orders/${orderId}`)
      const ord = response.data?.order || response.data?.data?.order || response.data || null

      if (!ord) return null

      const invoiceId = ord.invoiceId || ord.invoice?._id
      let invoiceData = null

      if (invoiceId) {
        try {
          const invResponse = await httpClient.get<any>(`/admin/invoices/${invoiceId}`)
          invoiceData =
            invResponse.data?.invoice ||
            invResponse.data?.data?.invoice ||
            invResponse.data?.data ||
            invResponse.data
        } catch (error) {
          console.error('Failed to fetch invoice:', error)
        }
      }
      return transformOrder(ord, invoiceData) as OrderDetail
    } catch (err) {
      console.error('Failed to fetch order detail:', err)
      return null
    }
  }

  return {
    orders,
    rxOrders,
    pendingOrders,
    processedOrders,
    loading: ordersQuery.isLoading,
    isFetching: ordersQuery.isFetching,
    error: ordersQuery.error,
    fetchOrders,
    fetchOrderDetail,
    invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ['sales', 'orders'] })
  }
}

export const useSalesStaffOrderDetail = (orderId: string | null | number) => {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) return null

      // FIRST STEP: Fetch the order
      const response = await httpClient.get<any>(`/admin/orders/${orderId}`)
      const ord = response.data?.order || response.data?.data?.order || response.data || null

      if (!ord) return null

      const invoiceId = ord.invoiceId || ord.invoice?._id

      // SECOND STEP: Fetch invoice if exists.
      // Note: This is still sequential because we need invoiceId,
      // but TanStack Query will cache the results.
      if (invoiceId) {
        try {
          const invResponse = await httpClient.get<any>(`/admin/invoices/${invoiceId}`)
          const invoiceData =
            invResponse.data?.invoice ||
            invResponse.data?.data?.invoice ||
            invResponse.data?.data ||
            invResponse.data
          return transformOrder(ord, invoiceData) as OrderDetail
        } catch (error) {
          console.error('Failed to fetch invoice:', error)
        }
      }

      return transformOrder(ord, null) as OrderDetail
    },
    enabled: !!orderId,
    staleTime: 60000 // 1 minute
  })
}
