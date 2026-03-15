import { IoArrowForward } from 'react-icons/io5'
import { Button } from '@/shared/components/ui'
import { OrderType } from '@/shared/utils/enums/order.enum'

interface OrderSummaryItemProps {
  order: any
  idx: number
  onNavigate: () => void
  onApprove: (e: React.MouseEvent) => void
  processing: boolean
}

export function OrderSummaryItem({
  order,
  idx,
  onNavigate,
  onApprove,
  processing
}: OrderSummaryItemProps) {
  const getSimplifiedStatus = (s: string) => {
    const status = (s || 'PENDING').toUpperCase()
    if (['REJECT', 'REJECTED', 'CANCELED'].includes(status))
      return { label: 'REJECTED', className: 'bg-rose-50 text-rose-600 border-rose-100' }
    if (
      [
        'VERIFIED',
        'APPROVE',
        'APPROVED',
        'WAITING_ASSIGN',
        'ASSIGNED',
        'MAKING',
        'PACKAGING',
        'COMPLETED',
        'ONBOARD',
        'DELIVERED',
        'DELIVERING',
        'SHIPPED',
        'PROCESSING'
      ].includes(status)
    )
      return { label: 'ACCEPTED', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    return { label: 'NEED VERIFY', className: 'bg-amber-50 text-amber-600 border-amber-100' }
  }

  const s = getSimplifiedStatus(order.status)
  const isApprovable = s.label === 'NEED VERIFY'
  const types = Array.isArray(order.type) ? order.type : order.type ? [order.type] : []
  const displayType =
    types.some((t: any) => String(t).includes(OrderType.MANUFACTURING)) || order.isPrescription
      ? 'PRESCRIPTION'
      : types.some((t: any) => String(t).includes(OrderType.PRE_ORDER))
        ? 'PRE-ORDER'
        : 'REGULAR'

  return (
    <div
      className="group bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-xl transition-all cursor-pointer"
      onClick={onNavigate}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-mint-600 uppercase font-bold">
            <span>#{(idx + 1).toString().padStart(2, '0')}</span>
          </div>
          <span className="text-base font-semibold text-slate-900">{displayType}</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border ${s.className}`}
          >
            {s.label}
          </span>
          {isApprovable && (
            <Button
              size="sm"
              className="text-[9px] h-7 bg-emerald-500 hover:bg-emerald-600 text-white border-none mt-1"
              disabled={processing}
              onClick={onApprove}
            >
              Approve
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-neutral-50">
        <span className="text-xs text-slate-400 group-hover:text-slate-600">View details</span>
        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
          <IoArrowForward size={14} />
        </div>
      </div>
    </div>
  )
}
