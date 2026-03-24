import React from 'react'
import { IoLocationOutline, IoStatsChartOutline } from 'react-icons/io5'
import type { TopSalesStats } from '@/shared/types/report.types'
import { formatPrice } from '@/shared/utils'

interface CustomerGrowthProps {
  stats?: TopSalesStats
  isLoading?: boolean
}

export const CustomerGrowth: React.FC<CustomerGrowthProps> = ({ stats, isLoading }) => {
  const cities = stats?.topCities || []
  const totalInvoices = cities.reduce((sum, city) => sum + city.invoiceCount, 0)
  const totalAmount = cities.reduce((sum, city) => sum + city.totalAmount, 0)

  return (
    <div className="p-8 bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30_rgb(0,0,0,0.04)] h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-heading tracking-tight">
            Customer Growth & Regional Sales
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800 tracking-tighter">
              {totalInvoices}
            </span>
            <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              Active Areas
            </span>
            {stats && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-mint-600 bg-mint-50/50 border border-mint-100/50 ml-2">
                <IoLocationOutline size={10} />
                {cities.length} Cities
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <IoStatsChartOutline className="text-slate-300" />
              Regional Breakdown
            </p>
            <div className="space-y-3.5">
              {cities.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-mint-400/20 border border-mint-400 shrink-0" />
                    <span className="text-[12px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate">
                      {item.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[12px] font-bold text-slate-800">
                        {item.invoiceCount} orders
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono font-bold">
                        {formatPrice(item.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {cities.length === 0 && (
                <p className="text-xs text-slate-300 italic py-4">
                  No regional data available for this period.
                </p>
              )}
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-50/50 flex flex-col items-center justify-center p-8 border border-slate-100/50 min-h-[240px]">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-5 border border-slate-100 relative group transition-all">
                <div className="absolute inset-0 rounded-full border-4 border-mint-500/10 border-t-mint-500/30" />
                <span className="text-2xl font-black text-slate-800 tracking-tighter">
                  {totalInvoices}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Monthly Customers</h4>
              <div className="text-[11px] text-slate-400 font-medium space-y-0.5">
                <p className="uppercase tracking-widest text-[9px] font-bold">Total Revenue</p>
                <p className="text-mint-600 font-black text-base tracking-tight">
                  {formatPrice(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
