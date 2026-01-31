import { Card } from '@/shared/components/ui/card'

export const SalesStaffDashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="lg:col-span-2 p-6 flex flex-col h-full ring-1 ring-neutral-100 shadow-sm min-h-[350px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales Trends</h3>
        <div className="flex-1 relative flex items-center justify-center">
          <span className="text-sm text-slate-300 font-medium italic opacity-50">
            Trend Visualization
          </span>
        </div>
      </Card>

      <Card className="p-6 flex flex-col h-full ring-1 ring-neutral-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Mix</h3>
        <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center">
          <div className="w-40 h-40 rounded-full border-[12px] border-slate-50 flex items-center justify-center">
            <div>
              <span className="block text-2xl font-bold text-slate-800">1.2k</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
