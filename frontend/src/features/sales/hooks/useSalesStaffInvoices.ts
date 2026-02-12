import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import type { Invoice, Order } from '../types'
import type { AdminInvoiceListItem } from '@/shared/types'
import { OrderType } from '@/shared/utils/enums/order.enum'

export function useSalesStaffInvoices(
  page: number = 1,
  limit: number = 10,
  status: string = 'All'
) {
  const query = useQuery({
    queryKey: ['sales', 'invoices', { page, limit, status }],
    queryFn: async () => {
      const apiStatus = status === 'All' ? undefined : status
      const response = await salesService.getDepositedInvoices(page, limit, apiStatus)

      // Extract data safely - httpClient returns response.data directly
      const apiData = response?.data
      const invoiceData = apiData?.invoiceList || []
      const pagination = apiData?.pagination || { totalPages: 1, total: 0 }

      // ENRICHMENT OPTIMIZATION:
      const enrichedInvoices = await Promise.all(
        invoiceData.map(async (inv: AdminInvoiceListItem) => {
          try {
            const orderItems = inv.orders || []

            const ordersWithDetails = await Promise.all(
              orderItems.slice(0, 10).map(async (item) => {
                const orderId = item.id
                try {
                  const detailRes = await salesService.getOrderById(orderId)
                  // Handle different possible API response structures
                  const orderData: Order =
                    detailRes.data?.order || (detailRes.data as unknown as Order)

                  if (!orderData || !orderData._id) {
                    throw new Error('Invalid order data')
                  }

                  const isMfg =
                    orderData.type?.includes(OrderType.MANUFACTURING) ||
                    orderData.isPrescription ||
                    (Array.isArray(orderData.type) &&
                      orderData.type.some((t: string) =>
                        String(t).includes(OrderType.MANUFACTURING)
                      ))

                  return {
                    id: orderData._id,
                    type: orderData.type || [],
                    status: orderData.status || 'PENDING',
                    isPrescription: !!isMfg
                  }
                } catch (err) {
                  console.error(`Failed to fetch order ${orderId}:`, err)
                  // Fallback to basic info if detail fetch fails
                  return {
                    id: orderId,
                    type: item.type || [],
                    status: 'PENDING', // Default to PENDING instead of UNKNOWN
                    isPrescription: item.type?.some((t) => String(t).includes('MANUFACTURING'))
                  }
                }
              })
            )

            // Local Calculation: Normal orders are default approved.
            // Mfg orders must be in one of the approved/verified statuses.
            const totalOrdersCount = ordersWithDetails.length
            const approvedOrdersCount = ordersWithDetails.filter((o) => {
              if (!o.isPrescription) return true // Normal orders = default approved
              return [
                'VERIFIED',
                'APPROVED',
                'WAITING_ASSIGN',
                'ASSIGNED',
                'MAKING',
                'PACKAGING',
                'COMPLETED',
                'ONBOARD',
                'DELIVERED',
                'DELIVERING'
              ].includes(String(o.status).toUpperCase())
            }).length

            return {
              ...inv,
              orders: ordersWithDetails,
              totalOrdersCount,
              approvedOrdersCount
            } as Invoice
          } catch (err) {
            console.error('Failed to enrich invoice:', err)
            return {
              ...inv,
              orders: [],
              totalOrdersCount: 0,
              approvedOrdersCount: 0
            } as unknown as Invoice
          }
        })
      )

      return {
        invoices: enrichedInvoices,
        pagination
      }
    },
    staleTime: 60000 // Cache for 1 minute
  })

  return {
    invoices: query.data?.invoices || [],
    pagination: query.data?.pagination || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    fetchInvoices: query.refetch
  }
}

export function useSalesStaffOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      const response = await salesService.getOrderById(orderId)
      return response.data.order
    },
    enabled: !!orderId
  })
}
