import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { OrderType } from '@/shared/utils/enums/order.enum'
import type { Invoice } from '../types'

export function useSalesStaffInvoiceDetail(invoiceId: string | null) {
  return useQuery({
    queryKey: ['sales', 'invoice-detail', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null

      // Use getInvoiceById which returns detail
      const response = await salesService.getInvoiceById(invoiceId)
      const inv = response?.data

      if (!inv) throw new Error('Invoice not found')

      const orderIds = (inv.orders || []) as (string | { id?: string; _id?: string })[]

      const ordersWithDetails = (
        await Promise.all(
          orderIds.map(async (item) => {
            const id = (typeof item === 'string' ? item : item.id || item._id) as string
            if (!id) return null
            try {
              const detailRes = await salesService.getOrderById(id)
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
                ...o,
                id: o._id,
                isPrescription: isMfg,
                isVerified: isVerified
              }
            } catch {
              return {
                id: id,
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
    },
    enabled: !!invoiceId,
    staleTime: 30000
  })
}
