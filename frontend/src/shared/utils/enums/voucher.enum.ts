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

// Voucher Enums
export const VoucherStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  DISABLE: 'DISABLE'
} as const
export type VoucherStatus = (typeof VoucherStatus)[keyof typeof VoucherStatus]
