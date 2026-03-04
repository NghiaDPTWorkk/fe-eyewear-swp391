import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { salesService } from '../services/salesService'
import type { Order } from '../types'
import { transformOrder } from '../utils/orderUtils'

export function useSalesStaffOrders(page: number = 1, limit: number = 10, status: string = 'All') {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['sales', 'orders', { page, limit, status }],
    queryFn: async () => {
      const apiStatus = status === 'All' ? undefined : status
      const response = await httpClient.get<any>(
        ENDPOINTS.ORDERS.LIST_WITH_PARAMS(page, limit, apiStatus)
      )
      return response.data
    }
  })

  const invalidateOrders = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales', 'orders'] })
  }, [queryClient])

  const fetchOrders = useCallback(() => {
    query.refetch()
  }, [query])

  return {
    orders: (query.data?.orderList || []) as Order[],
    rxOrders: (query.data?.orderList || []) as Order[],
    pagination: query.data?.pagination || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    invalidateOrders,
    fetchOrders
  }
}

export function useSalesStaffOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      const response = await salesService.getOrderById(orderId)
      const order = response.data?.order || (response as any).order

      if (!order) throw new Error('Order data not found')

      const searchParams = new URLSearchParams(window.location.search)
      const urlInvoiceId = searchParams.get('invoiceId')
      const o = order as any
      const invoiceId =
        o.invoiceId || o.invoice_id || o.invoice?.id || o.invoice?._id || urlInvoiceId

      if (invoiceId) {
        try {
          const invRes = await salesService.getInvoiceById(invoiceId)
          const idata = invRes.data || (invRes as any)
          const invoice = idata?.invoice || idata

          if (invoice) {
            // Address could be an object { street, ward, district, city }
            let formattedAddr = invoice.address
            if (invoice.address && typeof invoice.address === 'object') {
              const a = invoice.address as any
              formattedAddr = [a.street, a.ward, a.district, a.city].filter(Boolean).join(', ')
            }

            return {
              ...order,
              customerName:
                order.customerName ||
                invoice.fullName ||
                invoice.fullNameVn ||
                invoice.name ||
                invoice.fullname ||
                (order as any).fullName,
              customerPhone:
                order.customerPhone || invoice.phone || invoice.phoneNumber || (order as any).phone,
              invoice: {
                ...invoice,
                address: formattedAddr
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch invoice for order detail enrichment:', error)
        }
      }

      return order
    },
    enabled: !!orderId
  })
}
