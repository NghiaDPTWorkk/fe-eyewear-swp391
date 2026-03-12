import React, { useMemo } from 'react'
import { Card } from '@/shared/components'
import { useRevenueStats } from '@/features/manager/hooks/useManagerReports'
import { formatPrice } from '@/shared/utils'

export const Charts: React.FC = () => {
  const { data: revenueData, isLoading } = useRevenueStats({
    period: 'day'
  })

  const trends = useMemo(() => {
    if (!revenueData?.rows) return []
    // Take last 7 entries for a "Weekly Trend" look
    return revenueData.rows.slice(-7)
  }, [revenueData])

  const maxRevenue = useMemo(() => {
    if (!trends.length) return 1
    return Math.max(...trends.map((t) => t.totalRevenue), 1)
  }, [trends])

  const totalRevenue = useMemo(() => {
    return trends.reduce((acc, row) => acc + row.totalRevenue, 0)
  }, [trends])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
      <Card className="lg:col-span-2 p-8 flex flex-col h-full border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px] min-h-[350px]">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 font-heading tracking-tight">
              Revenue Trends
            </h3>
            <p className="text-sm text-slate-400 font-medium">Daily performance tracking</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-mint-600 block">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total period
            </span>
          </div>
        </div>

        <div className="flex-1 relative flex items-end justify-between gap-2 px-2 pb-6 pt-10">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
            </div>
          ) : trends.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 italic text-sm">
              No revenue records found for this period.
            </div>
          ) : (
            trends.map((row, i) => {
              const height = (row.totalRevenue / maxRevenue) * 100
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-bold">
                    {formatPrice(row.totalRevenue)}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[40px] bg-mint-100 rounded-t-xl transition-all group-hover:bg-mint-500 group-hover:shadow-lg group-hover:shadow-mint-100 cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />

                  {/* Label */}
                  <span className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-70 group-hover:opacity-100 group-hover:text-slate-600 group-hover:font-black transition-all">
                    {row.period.split('-').slice(-1)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </Card>

      <Card className="p-8 flex flex-col h-full border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
        <h3 className="text-xl font-bold text-slate-900 mb-6 font-heading tracking-tight">
          Performance Overview
        </h3>
        <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center">
          <div className="w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center relative shadow-inner">
            <div className="absolute inset-0 rounded-full border-[16px] border-mint-500 border-t-transparent border-r-transparent rotate-120" />
            <div className="z-10 bg-white rounded-full p-4 flex flex-col items-center justify-center shadow-sm w-32 h-32">
              <span className="block text-3xl font-bold text-slate-900 font-heading tracking-tighter">
                {trends.reduce((acc, curr) => acc + curr.invoiceCount, 0)}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                Closed Invoices
              </span>
            </div>
          </div>
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-widest">Achieved</span>
              <span className="text-slate-900 font-black">75%</span>
            </div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
              <div
                className="bg-mint-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(74,215,176,0.3)]"
                style={{ width: '75%' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Your monthly target is almost there!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
