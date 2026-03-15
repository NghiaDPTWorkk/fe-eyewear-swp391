import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'

export interface Order {
  id: string
  orderCode?: string
  orderType: string
  customer: string
  item: string
  waitingFor?: string
  currentStatus: string
  timeElapsed: string
  statusColor: string
  isNextActive: boolean
  price?: number
  assignedStaff?: string
  createdAt: string
}

export const calculateTimeElapsed = (createdAt: string): string => {
  const diff = new Date().getTime() - new Date(createdAt).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-600',
    [OrderStatus.ASSIGNED]: 'bg-blue-100 text-blue-600',
    [OrderStatus.MAKING]: 'bg-purple-100 text-purple-600',
    [OrderStatus.PACKAGING]: 'bg-indigo-100 text-indigo-600',
    [OrderStatus.COMPLETED]: 'bg-emerald-100 text-emerald-600',
    [OrderStatus.CANCELED]: 'bg-red-100 text-red-600',
    [OrderStatus.REFUNDED]: 'bg-gray-100 text-gray-600'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

export const getOrderType = (types: string[]): string => {
  if (types.includes('PRE_ORDER') || types.includes('PRE-ORDER')) return OrderType.PRE_ORDER
  if (types.includes('MANUFACTURING')) return OrderType.MANUFACTURING
  if (types.includes('RETURN')) return OrderType.RETURN
  return OrderType.NORMAL
}

export const transformApiOrderToTableOrder = (apiOrder: any): Order => {
  return {
    id: apiOrder._id,
    orderCode: apiOrder.orderCode,
    orderType: getOrderType(apiOrder.type || []),
    customer: apiOrder.customerName || apiOrder.invoice?.fullName || 'N/A',
    item: apiOrder.products?.[0]?.product?.sku || 'N/A',
    currentStatus: apiOrder.status,
    timeElapsed: calculateTimeElapsed(apiOrder.createdAt),
    statusColor: getStatusColor(apiOrder.status),
    createdAt: apiOrder.createdAt,
    isNextActive:
      apiOrder.status !== OrderStatus.COMPLETED && apiOrder.status !== OrderStatus.PACKAGING,
    price: apiOrder.price,
    assignedStaff: apiOrder.assignedStaff
  }
}
