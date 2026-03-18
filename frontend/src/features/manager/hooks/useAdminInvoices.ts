import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import { invoiceAdminService } from '@/shared/services/admin/invoiceService'
import { OrderType } from '@/shared/utils/enums/order.enum'

interface EnrichedOrder {
  id: string
  type: string[]
  status: string
  isPrescription: boolean
}

export interface EnrichedInvoice {
  id: string
  _id?: string
  invoiceCode: string
  fullName: string
  phone: string
  finalPrice: string
  status: string
  createdAt: string
  address: string
  orders: EnrichedOrder[]
}

export function useAdminInvoices(page: number, limit: number, status?: string) {
  return useQuery({
    queryKey: ['admin-invoices-enriched', page, limit, status],
    queryFn: async () => {
      const response = await invoiceAdminService.getInvoices(page, limit, status)
      const apiData = response?.data
      const invoiceData = apiData?.invoiceList || []
      const pagination = apiData?.pagination

      const enrichedInvoices: EnrichedInvoice[] = await Promise.all(
        invoiceData.map(async (inv) => {
          try {
            const orderIds = (inv.orders || []) as (
              | string
              | { id?: string; _id?: string; type?: string[] }
            )[]

            const ordersWithDetails = (
              await Promise.all(
                orderIds.map(async (item) => {
                  if (typeof item === 'object' && item.type && item.type.length > 0) {
                    const isMfg = item.type.some((t: string) =>
                      String(t).includes(OrderType.MANUFACTURING)
                    )
                    return {
                      id: item.id || item._id || '',
                      type: item.type,
                      status: 'UNKNOWN',
                      isPrescription: isMfg
                    }
                  }

                  const orderId = (typeof item === 'string' ? item : item.id || item._id) as string
                  if (!orderId) return null

                  try {
                    const detailRes = await httpClient.get<{
                      success: boolean
                      data: { order: { _id: string; type: string | string[]; status: string } }
                    }>(ENDPOINTS.ORDERS.DETAIL(orderId))

                    const o = detailRes.data.order
                    const typeArr = Array.isArray(o.type) ? o.type : [o.type]
                    const isMfg = typeArr.some((t) => String(t).includes(OrderType.MANUFACTURING))

                    return {
                      id: o._id,
                      type: typeArr,
                      status: o.status,
                      isPrescription: isMfg
                    }
                  } catch {
                    return {
                      id: orderId,
                      type: [] as string[],
                      status: 'UNKNOWN',
                      isPrescription: false
                    }
                  }
                })
              )
            ).filter(Boolean) as EnrichedOrder[]

            return {
              ...inv,
              id: inv.id || inv._id || '',
              orders: ordersWithDetails
            } as EnrichedInvoice
          } catch {
            return {
              ...inv,
              id: inv.id || inv._id || '',
              orders: []
            } as EnrichedInvoice
          }
        })
      )

      return {
        success: response.success,
        message: response.message,
        data: {
          pagination,
          invoiceList: enrichedInvoices
        }
      }
    },
    staleTime: 60_000
  })
}
