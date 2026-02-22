import { Card } from '@/shared/components'

export const Charts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
      <Card className="lg:col-span-2 p-8 flex flex-col h-full border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px] min-h-[350px]">
        <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading tracking-tight">
          Sales Trends
        </h3>
        <div className="flex-1 relative flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-4">
              {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                <div
                  key={i}
                  className="w-3 bg-mint-200 rounded-t-lg transition-all hover:bg-mint-400 cursor-pointer"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Live Revenue Stream
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-8 flex flex-col h-full border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
        <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading tracking-tight">
          Order Mix
        </h3>
        <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center">
          <div className="w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center relative shadow-inner">
            <div className="absolute inset-0 rounded-full border-[16px] border-mint-500 border-t-transparent border-r-transparent rotate-45" />
            <div className="z-10 bg-white rounded-full p-4 flex flex-col items-center justify-center shadow-sm w-32 h-32">
              <span className="block text-3xl font-bold text-slate-900 font-heading tracking-tighter">
                1.2k
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Analytics
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-mint-500 shadow-sm shadow-mint-200" />
              <span className="text-xs font-bold text-slate-500">RX Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-500">Standard</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
