import { fmtDate } from '@/components/layout/staff/manager-staff/voucher-table/VoucherTdata.utils'

interface SystemMetaVoucherProps {
  id: string
  createdAt: string
  updatedAt: string
}

export default function SystemMetaVoucher({ id, createdAt, updatedAt }: SystemMetaVoucherProps) {
  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-4">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        System Properties
      </h4>
      <div className="space-y-3">
        <MetaRow label="UUID" value={id} isMono />
        <MetaRow label="Registered" value={fmtDate(createdAt)} />
        <MetaRow label="Last Update" value={fmtDate(updatedAt)} />
      </div>
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-mint-600">
          <div className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Verifying integrity...
          </span>
        </div>
      </div>
    </div>
  )
}

function MetaRow({
  label,
  value,
  isMono = false
}: {
  label: string
  value: string
  isMono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
        {label}
      </span>
      <span
        className={`text-[10px] font-bold text-slate-600 truncate ${isMono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}
