import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { OrderStatus } from '@/shared/utils/enums/order.enum'

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

        if (status === OrderStatus.WAITING_ASSIGN) {
          progress = 25
          progressColor = 'bg-amber-400'
          station = 'Wait Assign'
          stationColor = 'bg-amber-100 text-amber-600'
        } else if (status === OrderStatus.ASSIGNED) {
          progress = 50
          progressColor = 'bg-purple-400'
          station = 'Assigned'
          stationColor = 'bg-purple-100 text-purple-600'
        } else if (status === OrderStatus.MAKING) {
          progress = 75
          progressColor = 'bg-blue-400'
          station = 'Production'
          stationColor = 'bg-blue-100 text-blue-600'
        } else if (status === OrderStatus.PACKAGING || status === OrderStatus.COMPLETED) {
          progress = 100
          progressColor = 'bg-emerald-400'
          station = status === OrderStatus.PACKAGING ? 'Packaging' : 'Finished'
          stationColor = 'bg-emerald-100 text-emerald-600'
        } else if (status === OrderStatus.APPROVED || status === OrderStatus.PENDING) {
          progress = 10
          progressColor = 'bg-slate-300'
          station = 'Verified'
          stationColor = 'bg-slate-100 text-slate-500'
        } else if (status === OrderStatus.CANCELED || status === OrderStatus.REJECTED) {
          progress = 0
          progressColor = 'bg-rose-400'
          station = status === OrderStatus.CANCELED ? 'Canceled' : 'Rejected'
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
