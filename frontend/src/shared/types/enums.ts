/**
 * Enums matching backend structure
 * Using const objects instead of enum for erasableSyntaxOnly compatibility
 */

// Order Enums
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

// Invoice Enums
export const InvoiceStatus = {
  PENDING: 'PENDING',
  DEPOSITED: 'DEPOSITED',
  WAITING_ASSIGN: 'WAITING_ASSIGNED',
  ONBOARD: 'ONBOARD',
  COMPLETED: 'COMPLETED',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED'
} as const
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]

// Payment Enums
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

// Product Enums
export const ProductType = {
  FRAME: 'frame',
  LENS: 'lens',
  SUNGLASS: 'sunglass'
} as const
export type ProductType = (typeof ProductType)[keyof typeof ProductType]

// Voucher Enums
export const VoucherStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  DISABLE: 'DISABLE'
} as const
export type VoucherStatus = (typeof VoucherStatus)[keyof typeof VoucherStatus]

export const VoucherDiscountType = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE'
} as const
export type VoucherDiscountType = (typeof VoucherDiscountType)[keyof typeof VoucherDiscountType]

export const VoucherApplyScope = {
  ALL: 'ALL',
  SPECIFIC: 'SPECIFIC'
} as const
export type VoucherApplyScope = (typeof VoucherApplyScope)[keyof typeof VoucherApplyScope]

// Attribute Enums
export const AttributeShowType = {
  COLOR: 'color',
  TEXT: 'text'
} as const
export type AttributeShowType = (typeof AttributeShowType)[keyof typeof AttributeShowType]

// Gender Enum
export const Gender = {
  FEMALE: 'F',
  MALE: 'M',
  NON_BINARY: 'N'
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]
