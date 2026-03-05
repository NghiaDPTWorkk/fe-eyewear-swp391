import type { VoucherStatus, VoucherDiscountType, VoucherApplyScope } from './enums'

export interface Voucher {
  _id: string
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number
  usageLimit: number
  usageCount: number
  startedDate: string
  endedDate: string
  minOrderValue: number
  maxDiscountValue: number
  applyScope: VoucherApplyScope
  status: VoucherStatus
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface GetMyVouchersResponse {
  success: boolean
  message: string
  data: {
    vouchers: Voucher[]
  }
}
