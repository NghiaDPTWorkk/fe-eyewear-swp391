import { IoStatsChartOutline } from 'react-icons/io5'

interface UsageMestrictVoucherProps {
  usageCount: number
  usageLimit: number
}

export default function UsageMestrictVoucher({
  usageCount,
  usageLimit
}: UsageMestrictVoucherProps) {
  const usagePct = Math.min((usageCount / (usageLimit || 1)) * 100, 100)

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-in slide-in-from-right-5 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IoStatsChartOutline className="text-mint-500" size={18} />
          <h3 className="text-sm font-bold text-slate-800">Usage Analytics</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{usageCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Coupons Redeemed
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700">/ {usageLimit}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Pool
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div
              className="h-full bg-mint-500 transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
            {Math.round(usagePct)}% Utilized
          </p>
        </div>
      </div>
    </div>
  )
}
