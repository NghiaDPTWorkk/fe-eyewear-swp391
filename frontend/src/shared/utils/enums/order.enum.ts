// Order Type Enum
export enum OrderType {
  NORMAL = 'NORMAL',
  PRE_ORDER = 'PRE-ORDER',
  MANUFACTURING = 'MANUFACTURING',
  RETURN = 'RETURN'
}

// Order Status Enum
export enum OrderStatus {
  PENDING = 'PENDING', // Chờ xác minh
  WAITING_VERIFY = 'WAITING_VERIFY', // Chờ xác minh
  VERIFIED = 'VERIFIED', // Đã xác minh
  APPROVE = 'APPROVE', // Đã duyệt
  REJECT = 'REJECT', // Đã từ chối
  WAITING_ASSIGN = 'WAITING_ASSIGN', // Chờ phân công
  ASSIGNED = 'ASSIGNED', // Đã phân công
  MAKING = 'MAKING', // Đang sản xuất
  PACKAGING = 'PACKAGING', // Đã đóng gói
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  WAITING_REFUND = 'WAITING_REFUND', // Chờ hoàn tiền
  REFUNDED = 'REFUNDED' // Đã hoàn tiền
}

export const AssignmentOrderStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const
export type AssignmentOrderStatus =
  (typeof AssignmentOrderStatus)[keyof typeof AssignmentOrderStatus]
