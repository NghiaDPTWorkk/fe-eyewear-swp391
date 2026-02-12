import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { Invoice } from '../types'

export function useSalesStaffInvoices(
  page: number = 1,
  limit: number = 10,
  status: string = 'All',
  search?: string
) {
  const query = useQuery({
    queryKey: ['sales', 'invoices', { page, limit, status, search }],
    queryFn: async () => {
      let apiStatus: string | undefined = undefined
      let apiStatuses: string | undefined = undefined

      if (status === 'APPROVED_OR_REJECTED') {
        // Fetch all finalized/active statuses for the Approved tab
        apiStatuses = [
          InvoiceStatus.APPROVED,
          InvoiceStatus.ONBOARD,
          InvoiceStatus.READY_TO_SHIP,
          InvoiceStatus.DELIVERING,
          InvoiceStatus.DELIVERED,
          InvoiceStatus.COMPLETED,
          InvoiceStatus.REJECTED,
          InvoiceStatus.CANCELED
        ].join(',')
      } else if (status === 'All') {
        apiStatus = undefined
      } else {
        apiStatus = status
      }

      const response = await salesService.getDepositedInvoices(
        page,
        limit,
        apiStatus,
        apiStatuses,
        search
      )

      // Extract data safely
      const apiData = response?.data
      const invoiceData = apiData?.invoiceList || []
      const pagination = apiData?.pagination || { totalPages: 1, total: 0 }

      // ENRICHMENT OPTIMIZATION:
      const enrichedInvoices = await Promise.all(
        invoiceData.map(async (inv: { id?: string; _id?: string; orders?: unknown[] }) => {
          try {
            const orderIds = (inv.orders || []) as (string | { id?: string; _id?: string })[]

            const ordersWithDetails = (
              await Promise.all(
                orderIds.map(async (item) => {
                  const orderId = (typeof item === 'string' ? item : item.id || item._id) as string
                  if (!orderId) return null
                  try {
                    const detailRes = await salesService.getOrderById(orderId)
                    const o = detailRes.data.order

                    const isMfg = (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
                      String(t).includes(OrderType.MANUFACTURING)
                    )

                    const isVerified = [
                      'VERIFIED',
                      'APPROVE',
                      'APPROVED',
                      'WAITING_ASSIGN',
                      'ASSIGNED',
                      'MAKING',
                      'PACKAGING',
                      'COMPLETED',
                      'ONBOARD',
                      'DELIVERED',
                      'DELIVERING',
                      'SHIPPED',
                      'PROCESSING'
                    ].includes(o.status?.toUpperCase())

                    return {
                      id: o._id,
                      type: o.type,
                      status: o.status,
                      isPrescription: isMfg,
                      isVerified: isVerified
                    }
                  } catch {
                    return {
                      id: orderId,
                      type: [],
                      status: 'UNKNOWN',
                      isPrescription: false,
                      isVerified: false
                    }
                  }
                })
              )
            ).filter(Boolean) as {
              id: string
              type: unknown
              status: string
              isPrescription: boolean
              isVerified: boolean
            }[]

            // approvedOrdersCount should include:
            // 1. All prescription orders that are verified
            // 2. All NON-prescription orders (considered approved by default)
            const approvedCount = ordersWithDetails.filter(
              (o) => o && (!o.isPrescription || o.isVerified)
            ).length

            return {
              ...inv,
              id: inv.id || inv._id,
              orders: ordersWithDetails,
              totalOrdersCount: ordersWithDetails.length,
              approvedOrdersCount: approvedCount
            } as unknown as Invoice
          } catch {
            return {
              ...inv,
              id: inv.id || inv._id,
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
