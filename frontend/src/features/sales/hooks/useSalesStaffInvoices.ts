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
  enabled: boolean = true,
  skipEnrichment: boolean = true
) {
  const query = useQuery({
    queryKey: ['sales', 'invoices', { page, limit, status, search, skipEnrichment }],
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

      if (skipEnrichment) {
        return {
          invoices: invoiceData.map((inv: any) => {
            const rawOrders = (inv.orders || []) as any[]
            const processedOrders = rawOrders.map((o) => {
              if (typeof o === 'object' && o !== null) {
                return {
                  id: o.id || o._id,
                  type: o.type || [],
                  status: o.status || 'UNKNOWN'
                }
              }
              return o
            })

            const hasManufacturing =
              inv.hasManufacturing ||
              processedOrders.some((o) =>
                (Array.isArray(o.type) ? o.type : [o.type]).some((t: any) =>
                  String(t).includes(OrderType.MANUFACTURING)
                )
              )

            return {
              ...inv,
              id: inv.id || inv._id,
              orders: processedOrders,
              totalOrdersCount: inv.totalOrdersCount || processedOrders.length || 0,
              approvedOrdersCount: inv.approvedOrdersCount || 0,
              hasManufacturing
            }
          }),
          pagination
        }
      }

      const enrichedInvoices = await Promise.all(
        invoiceData.map(async (inv: any) => {
          try {
            const orderIds = (inv.orders || []) as (string | { id?: string; _id?: string })[]
            const ordersWithDetails = await Promise.all(
              orderIds.map(async (item) => {
                const orderId = (typeof item === 'string' ? item : item.id || item._id) as string
                if (!orderId) return null
                if (typeof item === 'object' && 'type' in item && 'status' in item) {
                  const o = item as any
                  const isMfg = (Array.isArray(o.type) ? o.type : [o.type]).some((t: string) =>
                    String(t).includes(OrderType.MANUFACTURING)
                  )
                  const isVerified = (
                    [
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
                    ] as string[]
                  ).includes(o.status?.toUpperCase())

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
                  const isVerified = (
                    [
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
                    ] as string[]
                  ).includes(o.status?.toUpperCase())

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

            const finalOrders = ordersWithDetails.filter(Boolean) as any[]
            const approvedCount = finalOrders.filter((o) => o && o.isVerified).length
            const hasManufacturing = finalOrders.some((o) => o.isPrescription)

            return {
              ...inv,
              id: inv.id || inv._id,
              orders: finalOrders,
              totalOrdersCount: finalOrders.length,
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
