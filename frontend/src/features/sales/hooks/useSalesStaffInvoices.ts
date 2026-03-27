import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { OrderStatus, OrderType } from '@/shared/utils/enums/order.enum'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { Invoice } from '../types'

export function useSalesStaffInvoices(
  page: number = 1,
  limit: number = 10,
  status: string = 'All',
  search?: string,
  enabled: boolean = true
) {
  const query = useQuery({
    queryKey: ['sales', 'invoices', { page, limit, status, search }],
    enabled: !!enabled,
    queryFn: async () => {
      let apiStatus: string | undefined = undefined
      let apiStatuses: string | undefined = undefined

      if (status === 'APPROVED_OR_REJECTED') {
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

      const apiData = response?.data
      const invoiceData = apiData?.invoiceList || []
      const pagination = apiData?.pagination || { totalPages: 1, total: 0 }

      const enrichedInvoices = await Promise.all(
        invoiceData.map(async (inv: any) => {
          try {
            const orderIds = (inv.orders || []) as (string | { id?: string; _id?: string })[]

            const ordersWithDetails = (
              await Promise.all(
                orderIds.map(async (item) => {
                  const orderId = (typeof item === 'string' ? item : item.id || item._id) as string
                  if (!orderId) return null

                  // Optimization: If item is an object and has type/status, use it directly
                  if (typeof item === 'object' && 'type' in item) {
                    const o = item as any
                    const isMfg = (Array.isArray(o.type) ? o.type : [o.type]).some((t: string) =>
                      String(t).includes(OrderType.MANUFACTURING)
                    )
                    const verifiedStatuses = [
                      OrderStatus.VERIFIED,
                      OrderStatus.APPROVE,
                      OrderStatus.APPROVED,
                      OrderStatus.WAITING_ASSIGN,
                      OrderStatus.ASSIGNED,
                      OrderStatus.MAKING,
                      OrderStatus.PACKAGING,
                      OrderStatus.COMPLETED,
                      OrderStatus.ONBOARD,
                      OrderStatus.DELIVERED,
                      OrderStatus.DELIVERING,
                      OrderStatus.SHIPPED,
                      OrderStatus.PROCESSING
                    ]
                    const isVerified = (verifiedStatuses as string[]).includes(
                      o.status?.toUpperCase()
                    )
                    return {
                      id: orderId,
                      type: o.type,
                      status: o.status,
                      isPrescription: isMfg,
                      isVerified: isVerified
                    }
                  }

                  try {
                    const detailRes = await salesService.getOrderById(orderId)
                    const o = detailRes.data.order

                    const isMfg = (Array.isArray(o.type) ? o.type : [o.type]).some((t: string) =>
                      String(t).includes(OrderType.MANUFACTURING)
                    )

                    const verifiedStatuses = [
                      OrderStatus.VERIFIED,
                      OrderStatus.APPROVE,
                      OrderStatus.APPROVED,
                      OrderStatus.WAITING_ASSIGN,
                      OrderStatus.ASSIGNED,
                      OrderStatus.MAKING,
                      OrderStatus.PACKAGING,
                      OrderStatus.COMPLETED,
                      OrderStatus.ONBOARD,
                      OrderStatus.DELIVERED,
                      OrderStatus.DELIVERING,
                      OrderStatus.SHIPPED,
                      OrderStatus.PROCESSING
                    ]
                    const isVerified = (verifiedStatuses as string[]).includes(
                      o.status?.toUpperCase()
                    )

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
            ).filter(Boolean) as any[]

            const approvedCount = ordersWithDetails.filter((o) => o && o.isVerified).length
            const hasManufacturing = ordersWithDetails.some((o) => o.isPrescription)

            return {
              ...inv,
              id: inv.id || inv._id,
              orders: ordersWithDetails,
              totalOrdersCount: ordersWithDetails.length,
              approvedOrdersCount: approvedCount,
              hasManufacturing
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
    staleTime: 60000
  })

  return {
    invoices: query.data?.invoices || [],
    pagination: query.data?.pagination || null,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    fetchInvoices: query.refetch
  }
}
