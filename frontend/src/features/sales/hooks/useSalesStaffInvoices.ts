import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { Invoice } from '../types'
import { transformOrder } from '../utils/orderUtils'

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

export function useSalesStaffOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      const response = await salesService.getOrderById(orderId)
      const rawOrder = response.data.order

      // Fetch invoice detail to get full customer info if invoiceId exists
      const rawOrderData = rawOrder as any
      const invoiceId =
        rawOrderData.invoiceId ||
        rawOrderData.invoice?.id ||
        rawOrderData.invoice?._id ||
        (typeof rawOrderData.invoice === 'string' ? rawOrderData.invoice : undefined)
      let fullInvoice = rawOrderData.invoice

      // Fetch if we have an ID AND (we don't have an invoice object OR the object is missing basic info)
      const needsFetch =
        !!invoiceId && (!fullInvoice || typeof fullInvoice === 'string' || !fullInvoice.fullName)

      if (needsFetch && typeof invoiceId === 'string') {
        try {
          const invRes = await salesService.getInvoiceById(invoiceId)
          // Handle case where API response structure is { success: true, data: { invoice: ... } }
          // or just the data directly
          fullInvoice = invRes.data?.invoice || invRes.data || invRes || rawOrderData.invoice
        } catch (err) {
          console.error('Failed to fetch invoice details for order:', err)
        }
      }

      return transformOrder(rawOrderData, fullInvoice)
    },
    enabled: !!orderId
  })
}

export function useSalesStaffLabOrders(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['sales', 'lab-orders', { page, limit }],
    queryFn: async () => {
      const response = await salesService.getManufacturingOrders(page, limit)
      const data = response?.data?.orders || { data: [], total: 0 }

      const mappedOrders = (data.data || []).map((o: any) => {
        const status = o.status?.toUpperCase()
        let progress = 0
        let progressColor = 'bg-neutral-200'
        let station = 'Pending'
        let stationColor = 'bg-neutral-100 text-neutral-500'

        if (status === 'WAITING_ASSIGN') {
          progress = 25
          progressColor = 'bg-amber-400'
          station = 'Wait Assign'
          stationColor = 'bg-amber-100 text-amber-600'
        } else if (status === 'ASSIGNED') {
          progress = 50
          progressColor = 'bg-purple-400'
          station = 'Assigned'
          stationColor = 'bg-purple-100 text-purple-600'
        } else if (status === 'MAKING') {
          progress = 75
          progressColor = 'bg-blue-400'
          station = 'Production'
          stationColor = 'bg-blue-100 text-blue-600'
        } else if (status === 'PACKAGING' || status === 'COMPLETED') {
          progress = 100
          progressColor = 'bg-emerald-400'
          station = status === 'PACKAGING' ? 'Packaging' : 'Finished'
          stationColor = 'bg-emerald-100 text-emerald-600'
        } else if (status === 'APPROVED' || status === 'PENDING') {
          progress = 10
          progressColor = 'bg-slate-300'
          station = 'Verified'
          stationColor = 'bg-slate-100 text-slate-500'
        } else if (status === 'CANCELED' || status === 'REJECTED') {
          progress = 0
          progressColor = 'bg-rose-400'
          station = status === 'CANCELED' ? 'Canceled' : 'Rejected'
          stationColor = 'bg-rose-100 text-rose-600'
        }

        return {
          id: `#${o.orderCode?.split('_')[1] || o._id.slice(-4)}`,
          orderCode: o.orderCode,
          fullId: o._id,
          type: o.products?.[0]?.product?.sku || 'Custom Lens',
          material: o.products?.[0]?.lens?.sku || 'Standard Material',
          station,
          stationColor,
          progress,
          progressColor,
          time: o.updatedAt
            ? new Date(o.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Active',
          order: o
        }
      })

      return {
        orders: mappedOrders,
        pagination: {
          total: data.total,
          page: data.page,
          totalPages: data.totalPages
        }
      }
    },
    staleTime: 30000
  })
}
