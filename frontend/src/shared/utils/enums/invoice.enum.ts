// Invoice Status Enum
export enum InvoiceStatus {
  PENDING = 'PENDING', // Chờ đặt cọc
  DEPOSITED = 'DEPOSITED', // Đã đặt cọc
  APPROVED = 'APPROVED', // Đã duyệt bởi sale
  ONBOARD = 'ONBOARD', // Manager đang quản lý
  COMPLETED = 'COMPLETED', // Hoàn thành (tất cả orders đã COMPLETE)
  READY_TO_SHIP = 'READY_TO_SHIP', // Chờ đơn vị vận chuyển tới lấy hàng
  DELIVERING = 'DELIVERING', // Đang giao hàng
  DELIVERED = 'DELIVERED', // Đã giao hàng
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
  REJECTED = 'REJECTED', // Bị từ chối
  CANCELED = 'CANCELED', // Đã hủy
  WAITING_ASSIGN = 'WAITING_ASSIGN', // Chờ gán quản lý
  CANCEL = 'CANCEL' // Đã hủy (alias)
}

export const CUSTOMER_STATUS = {
  PENDING: 'Waiting for Payment',
  DEPOSITED: 'Waiting Confirmed',
  APPROVED: 'Order Confirmed',
  ONBOARD: 'Process',
  COMPLETED: 'Ready to Ship',
  READY_TO_SHIP: 'Ready to Ship',
  DELIVERING: 'Shipping',
  DELIVERED: 'Delivered',
  REFUNDED: 'Closed',
  REJECTED: 'Closed',
  CANCELED: 'Closed',
  WAITING_ASSIGN: 'Process',
  CANCEL: 'Closed'
} as const

export const DETAILED_ORDER_STATUS = {
  PENDING: 'Payment Pending',
  DEPOSITED: 'Payment Verified',
  APPROVED: 'Order Confirmed',
  ONBOARD: 'Crafting & Processing',
  COMPLETED: 'Quality Inspection',
  READY_TO_SHIP: 'Ready to Ship',
  DELIVERING: 'In Transit',
  DELIVERED: 'Delivered Successfully',
  REFUNDED: 'Order Refunded',
  REJECTED: 'Order Rejected',
  CANCELED: 'Order Cancelled',
  WAITING_ASSIGN: 'Waiting for Assignment',
  CANCEL: 'Order Cancelled'
} as const
