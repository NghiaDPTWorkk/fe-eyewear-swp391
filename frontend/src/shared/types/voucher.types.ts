import type {
  VoucherStatus,
  VoucherDiscountType,
  VoucherApplyScope
} from '@/shared/utils/enums/voucher.enum'
export type { VoucherStatus, VoucherDiscountType, VoucherApplyScope }

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

export interface VoucherPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminVoucherListResponse {
  success: boolean
  message: string
  data: {
    voucherList?: Voucher[]
    items?:
      | {
          data: Voucher[]
          total: number
          page: number
          limit: number
          totalPages: number
        }
      | Voucher[]
    pagination?: VoucherPagination
    total?: number
    page?: number
    limit?: number
    totalPages?: number
  }
  pagination?: VoucherPagination
}

export interface VoucherPayload {
  name: string
  description: string
  code: string
  typeDiscount: string
  value: number
  usageLimit: number
  startedDate: string
  endedDate: string
  minOrderValue: number
  maxDiscountValue: number
  applyScope: string
  status: string
}

export interface VoucherMutateResponse {
  success: boolean
  message: string
  data: Voucher
}

export interface VoucherDetailResponse {
  success: boolean
  message: string
  data: {
    voucher: Voucher
  }
}
