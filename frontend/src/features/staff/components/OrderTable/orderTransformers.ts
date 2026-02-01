import type { OperationOrder } from '@/shared/types/operationOrder.types'
import type { Order } from './OrderTable'

/**
 * Helper: Tính thời gian đã trôi qua từ createdAt
 */
const calculateTimeElapsed = (createdAt: string): string => {
  const now = new Date()
  const created = new Date(createdAt)
  const diff = now.getTime() - created.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

/**
 * Helper: Map status sang màu
 */
const getStatusColor = (status: string): string => {
  const statusColorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-600',
    ASSIGNED: 'bg-blue-100 text-blue-600',
    IN_PROGRESS: 'bg-purple-100 text-purple-600',
    AWAITING_STOCK: 'bg-orange-100 text-orange-600',
    READY_TO_PACK: 'bg-green-100 text-green-600',
    PACKING: 'bg-indigo-100 text-indigo-600',
    PACKED: 'bg-gray-100 text-gray-600',
    COMPLETED: 'bg-emerald-100 text-emerald-600'
  }
  return statusColorMap[status] || 'bg-gray-100 text-gray-600'
}

/**
 * Helper: Map type array sang string hiển thị
 */
const getOrderType = (types: string[]): string => {
  if (types.includes('PRESCRIPTION')) return 'Prescription'
  if (types.includes('MANUFACTURING')) return 'Đơn Thường'
  if (types.includes('PRE_ORDER')) return 'Pre-order'
  return 'Đơn Thường'
}

/**
 * Helper: Xác định "Waiting For" dựa vào status
 */
const getWaitingFor = (order: OperationOrder): string | undefined => {
  if (order.status === 'AWAITING_STOCK') {
    // Lấy tên sản phẩm đầu tiên đang chờ
    const firstProduct = order.products[0]
    if (firstProduct?.product?.sku) {
      return `Gọng ${firstProduct.product.sku}`
    }
    return 'Gọng Titan'
  }
  if (order.status === 'IN_PROGRESS' && order.products[0]?.lens) {
    return `Tròng ${order.products[0].lens.sku}`
  }
  return undefined
}

/**
 * Main transform function: Chuyển đổi OperationOrder từ API sang Order cho OrderTable
 */
export const transformApiOrderToTableOrder = (apiOrder: OperationOrder): Order => {
  return {
    id: apiOrder._id,
    orderCode: apiOrder.orderCode,
    orderType: getOrderType(apiOrder.type),
    customer: 'N/A', // TODO: Cần fetch từ invoice hoặc customer data
    item: apiOrder.products[0]?.product?.sku || 'N/A',
    waitingFor: getWaitingFor(apiOrder),
    currentStatus: apiOrder.status,
    timeElapsed: calculateTimeElapsed(apiOrder.createdAt),
    statusColor: getStatusColor(apiOrder.status),
    isNextActive: apiOrder.status !== 'COMPLETED' && apiOrder.status !== 'PACKED',
    price: apiOrder.price,
    assignedStaff: apiOrder.assignedStaff
  }
}
