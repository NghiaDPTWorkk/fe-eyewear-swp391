import { Card } from '@/shared/components/ui/card'

export const SalesStaffDashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="lg:col-span-2 p-6 flex flex-col h-full ring-1 ring-neutral-100 shadow-sm min-h-[350px]">
        <h3 className="text-lg font-bold text-slate-900 mb-6 font-heading">Sales Trends</h3>
        <div className="flex-1 relative flex items-center justify-center bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
          <div className="text-center">
            <div className="flex justify-center gap-1.5 mb-2">
              {[40, 70, 45, 90, 65].map((h, i) => (
                <div
                  key={i}
                  className="w-2 bg-primary-200 rounded-t-sm"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Trend Interactive View
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6 flex flex-col h-full ring-1 ring-neutral-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 font-heading">Order Mix</h3>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center">
          <div className="w-44 h-44 rounded-full border-[14px] border-neutral-50 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-[14px] border-primary-500 border-t-transparent border-r-transparent rotate-45 opacity-20" />
            <div>
              <span className="block text-3xl font-bold text-slate-900 font-heading tracking-tight">
                1.2k
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Total Orders
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-[11px] font-bold text-slate-500">RX</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-secondary-400" />
              <span className="text-[11px] font-bold text-slate-500">Standard</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
