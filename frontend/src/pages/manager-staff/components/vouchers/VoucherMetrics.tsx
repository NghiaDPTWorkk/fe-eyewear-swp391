import {
  IoTicketOutline,
  IoFlashOutline,
  IoTimeOutline,
  IoCloseCircleOutline
} from 'react-icons/io5'
import { VoucherStatus } from '@/shared/utils/enums/voucher.enum'

interface VoucherMetricsProps {
  stats: Record<string, number>
  currentFilter: string
  onFilter: (key: string) => void
  isStatsLoading: boolean
}

export function VoucherMetrics({
  stats,
  currentFilter,
  onFilter,
  isStatsLoading
}: VoucherMetricsProps) {
  const items = [
    {
      key: 'all',
      label: 'Total Vouchers',
      value: stats['all'] ?? 0,
      icon: <IoTicketOutline />,
      color: 'bg-mint-50 text-mint-700'
    },
    {
      key: VoucherStatus.ACTIVE,
      label: 'Active Now',
      value: stats[VoucherStatus.ACTIVE] ?? 0,
      icon: <IoFlashOutline />,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      key: VoucherStatus.DRAFT,
      label: 'Drafts',
      value: stats[VoucherStatus.DRAFT] ?? 0,
      icon: <IoTimeOutline />,
      color: 'bg-sky-50 text-sky-600'
    },
    {
      key: VoucherStatus.DISABLE,
      label: 'Disabled',
      value: stats[VoucherStatus.DISABLE] ?? 0,
      icon: <IoCloseCircleOutline />,
      color: 'bg-red-50 text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((m) => {
        const active = currentFilter === m.key
        const trend = stats['all'] ? Math.round(((m.value ?? 0) / stats['all']) * 100) : 0
        return (
          <div
            key={m.key}
            onClick={() => onFilter(m.key)}
            className={`bg-white p-6 rounded-3xl transition-all cursor-pointer active:scale-95 border-none shadow-sm ring-1 ring-neutral-100/50 ${active ? 'ring-2 ring-mint-500 scale-[1.02] shadow-xl shadow-mint-100' : 'hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {m.label}
                </p>
                <h3 className="text-2xl font-bold mt-1.5 text-slate-900">
                  {isStatsLoading ? '...' : m.value}
                </h3>
              </div>
              <div className={`p-3.5 rounded-2xl text-xl ${m.color}`}>{m.icon}</div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
              <span
                className={m.key === VoucherStatus.DISABLE ? 'text-rose-500' : 'text-emerald-500'}
              >
                {m.key === VoucherStatus.DISABLE ? '↘' : '↗'} {trend}%
              </span>
              <span className="text-slate-400 normal-case font-medium">of total</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
