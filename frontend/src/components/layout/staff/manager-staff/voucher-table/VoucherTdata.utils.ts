import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'

export const VOUCHER_STATUS_CFG: Record<string, { label: string; dot: string; pill: string }> = {
  [VoucherStatus.ACTIVE]: {
    label: 'Active',
    dot: 'bg-emerald-400 animate-pulse',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  },
  [VoucherStatus.DRAFT]: {
    label: 'Draft',
    dot: 'bg-amber-400',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
  },
  [VoucherStatus.DISABLE]: {
    label: 'Disabled',
    dot: 'bg-slate-300',
    pill: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
  }
}

export function fmtVND(n: number | undefined | null) {
  if (n === null) return '—'
  return n?.toLocaleString('vi-VN')
}

export function fmtDate(d: string) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  } catch {
    return d
  }
}
