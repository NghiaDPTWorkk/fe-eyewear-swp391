export const PaymentMethodType = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  PAYOS: 'PAYOS'
} as const
export type PaymentMethodType = (typeof PaymentMethodType)[keyof typeof PaymentMethodType]

export const PaymentStatus = {
  PAID: 'PAID',
  UNPAID: 'UNPAID'
} as const
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]
