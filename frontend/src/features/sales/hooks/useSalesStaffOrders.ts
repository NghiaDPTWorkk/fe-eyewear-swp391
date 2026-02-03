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
      // 1. Fetch Invoices
      const response = await httpClient.get<any>('/admin/invoices/deposited', { signal })
      const invoices = response.data?.data || response.data || []

      const userOrders: any[] = []

      // 2. Extract basic order info
      if (Array.isArray(invoices)) {
        invoices.forEach((inv: any) => {
          if (Array.isArray(inv.orders)) {
            inv.orders.forEach((ord: any) => {
              userOrders.push({
                ...ord,
                invoice: inv // Pass parent invoice for context
              })
            })
          }
        })
      }

      // 3. Fetch detailed info for each order in parallel
      const detailedOrders = await Promise.all(
        userOrders.map(async (basicOrder) => {
          try {
            const detailRes = await httpClient.get<any>(`/admin/orders/${basicOrder.id}`)
            const detailData =
              detailRes.data?.data?.order || detailRes.data?.order || detailRes.data?.data

            // Merge detail data with basic info (detail takes precedence)
            return {
              ...basicOrder,
              ...detailData
            }
          } catch (error) {
            console.error(`Failed to fetch details for order ${basicOrder.id}`, error)
            return basicOrder // Fallback to basic info
          }
        })
      )

      // 4. Transform to application model
      return detailedOrders.map((ord) => transformOrder(ord, ord.invoice))
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

      return transformOrder(ord, null) as OrderDetail
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
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) return null

      const cachedOrders = queryClient.getQueryData<Order[]>(['sales', 'orders'])
      const cachedOrder = cachedOrders?.find((o) => o._id === orderId.toString())

      if (cachedOrder && cachedOrder.customerName !== 'Guest') {
        return cachedOrder
      }

      try {
        const response = await httpClient.get<any>(`/admin/orders/${orderId}`)
        const ord =
          response.data?.data?.order ||
          response.data?.order ||
          response.data?.data ||
          response.data ||
          null

        if (!ord) return null

        let invoiceData = null
        if (ord.invoiceId) {
          const cachedInvoices = queryClient.getQueryData<any[]>(['sales', 'invoices'])
          let invoice = cachedInvoices?.find(
            (i: any) => i.id === ord.invoiceId || i._id === ord.invoiceId
          )

          if (!invoice) {
            const invRes = await httpClient.get<any>('/admin/invoices/deposited')
            const invoices = invRes.data?.data || invRes.data || []
            if (Array.isArray(invoices)) {
              invoice = invoices.find((i: any) => i.id === ord.invoiceId || i._id === ord.invoiceId)
            }
          }
          invoiceData = invoice
        }

        return transformOrder(ord, invoiceData) as OrderDetail
      } catch (err) {
        console.error('Failed to fetch order detail:', err)
        return null
      }
    },
    enabled: !!orderId,
    staleTime: 60000 // 1 minute
  })
}
