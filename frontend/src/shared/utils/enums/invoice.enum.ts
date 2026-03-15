export enum InvoiceStatus {
  PENDING = 'PENDING',
  DEPOSITED = 'DEPOSITED',
  APPROVED = 'APPROVED',
  ONBOARD = 'ONBOARD',
  COMPLETED = 'COMPLETED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  REFUNDED = 'REFUNDED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  WAITING_ASSIGN = 'WAITING_ASSIGN',
  CANCEL = 'CANCEL'
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
