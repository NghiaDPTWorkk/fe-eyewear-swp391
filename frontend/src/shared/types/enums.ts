/**
 * Enums matching backend structure
 * Using const objects instead of enum for erasableSyntaxOnly compatibility
 */

export const OrderType = {
  NORMAL: 'NORMAL',
  PRE_ORDER: 'PRE_ORDER',
  MANUFACTURING: 'MANUFACTURING'
} as const
export type OrderType = (typeof OrderType)[keyof typeof OrderType]

export const OrderStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  APPROVED: 'APPROVED',
  ASSIGNED: 'ASSIGNED',
  MAKING: 'MAKING',
  PACKAGED: 'PACKAGED',
  REJECTED: 'REJECTED',
  CANCEL: 'CANCEL'
} as const
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const AssignmentOrderStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
} as const
export type AssignmentOrderStatus =
  (typeof AssignmentOrderStatus)[keyof typeof AssignmentOrderStatus]

export const InvoiceStatus = {
  PENDING: 'PENDING',
  DEPOSITED: 'DEPOSITED',
  WAITING_ASSIGN: 'WAITING_ASSIGN',
  ONBOARD: 'ONBOARD',
  COMPLETED: 'COMPLETED',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED'
} as const
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

export const PaymentMethodType = {
  COD: 'COD',
  ZALAPAY: 'ZALAPAY',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY'
} as const
export type PaymentMethodType = (typeof PaymentMethodType)[keyof typeof PaymentMethodType]

export const PaymentStatus = {
  PAID: 'PAID',
  UNPAID: 'UNPAID'
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]
