import type { VoucherStatus, VoucherDiscountType, VoucherApplyScope } from './enums'

/**
 * Voucher types matching backend structure
 */

export interface Voucher {
  _id: string
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number
  usageLimit: number
  usageCount: number
  startedDate: Date
  endedDate: Date
  minOrderValue: number
  maxDiscountValue: number
  applyScope: VoucherApplyScope
  status: VoucherStatus
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface CreateVoucherRequest {
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number
  usageLimit: number
  startedDate: Date
  endedDate: Date
  minOrderValue?: number
  maxDiscountValue: number
  applyScope: VoucherApplyScope
  status?: VoucherStatus
}

export interface UpdateVoucherRequest {
  name?: string
  description?: string
  typeDiscount?: VoucherDiscountType
  value?: number
  usageLimit?: number
  startedDate?: Date
  endedDate?: Date
  minOrderValue?: number
  maxDiscountValue?: number
  applyScope?: VoucherApplyScope
  status?: VoucherStatus
}

export interface VoucherResponse {
  voucher: Voucher
}

export interface VoucherListResponse {
  items: Voucher[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
