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
  createdAt?: string
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

const resolveInvoiceId = (inv: any): string => {
  return String(inv?.id || inv?._id || inv?.invoiceId || inv?.invoice_id || '')
}

const normalizeDateValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return ''

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString()
  }

  if (typeof value === 'number') {
    const ms = value < 1e12 ? value * 1000 : value
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? '' : d.toISOString()
  }

  if (typeof value === 'string') {
    const raw = value.trim()
    if (!raw) return ''

    if (/^\d+$/.test(raw)) {
      const num = Number(raw)
      if (!Number.isNaN(num)) {
        const ms = raw.length <= 10 ? num * 1000 : num
        const d = new Date(ms)
        return Number.isNaN(d.getTime()) ? '' : d.toISOString()
      }
    }

    const d = new Date(raw)
    return Number.isNaN(d.getTime()) ? '' : d.toISOString()
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    if (typeof obj.$date === 'string' || typeof obj.$date === 'number') {
      return normalizeDateValue(obj.$date)
    }

    if (typeof obj.seconds === 'number' || typeof obj._seconds === 'number') {
      const seconds = (obj.seconds as number | undefined) ?? (obj._seconds as number)
      return normalizeDateValue(seconds)
    }

    if (typeof obj.timestamp === 'number' || typeof obj.time === 'number') {
      const ts = (obj.timestamp as number | undefined) ?? (obj.time as number)
      return normalizeDateValue(ts)
    }
  }

  return ''
}

const resolveInvoiceCreatedAt = (inv: any): string => {
  const candidates = [
    inv?.createdAt,
    inv?.created_at,
    inv?.date,
    inv?.createdDate,
    inv?.created_date,
    inv?.updatedAt,
    inv?.updated_at
  ]

  for (const item of candidates) {
    const normalized = normalizeDateValue(item)
    if (normalized) return normalized
  }

  return ''
}

export function useAdminInvoices(
  page: number,
  limit: number,
  status?: string,
  searchQuery?: string
) {
  return useQuery({
    queryKey: ['admin-invoices-enriched', page, limit, status, searchQuery],
    queryFn: async () => {
      const response = await invoiceAdminService.getInvoices(page, limit, status, searchQuery)
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
                      isPrescription: isMfg,
                      createdAt: ''
                    }
                  }

                  const orderId = (typeof item === 'string' ? item : item.id || item._id) as string
                  if (!orderId) return null

                  try {
                    const detailRes = await httpClient.get<{
                      success: boolean
                      data: {
                        order: {
                          _id: string
                          type: string | string[]
                          status: string
                          createdAt?: string | number | Date
                        }
                      }
                    }>(ENDPOINTS.ORDERS.DETAIL(orderId))

                    const o = detailRes.data.order
                    const typeArr = Array.isArray(o.type) ? o.type : [o.type]
                    const isMfg = typeArr.some((t) => String(t).includes(OrderType.MANUFACTURING))

                    return {
                      id: o._id,
                      type: typeArr,
                      status: o.status,
                      isPrescription: isMfg,
                      createdAt: normalizeDateValue(o.createdAt)
                    }
                  } catch {
                    return {
                      id: orderId,
                      type: [] as string[],
                      status: 'UNKNOWN',
                      isPrescription: false,
                      createdAt: ''
                    }
                  }
                })
              )
            ).filter(Boolean) as EnrichedOrder[]

            const invoiceCreatedAt = resolveInvoiceCreatedAt(inv)
            const orderCreatedAt = ordersWithDetails.map((o) => o.createdAt || '').find((v) => !!v)

            return {
              ...inv,
              id: resolveInvoiceId(inv),
              createdAt: invoiceCreatedAt || orderCreatedAt || '',
              orders: ordersWithDetails
            } as EnrichedInvoice
          } catch {
            return {
              ...inv,
              id: resolveInvoiceId(inv),
              createdAt: resolveInvoiceCreatedAt(inv),
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
