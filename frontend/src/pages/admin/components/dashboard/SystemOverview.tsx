import React, { useMemo } from 'react'
import { IoChevronDownOutline } from 'react-icons/io5'
import { useRevenueStats } from '@/features/manager/hooks/useRevenueStats'
import { formatPrice } from '@/shared/utils/format.utils'

export const SystemOverview: React.FC = () => {
  const [period, setPeriod] = React.useState('month')
  const { data, isLoading } = useRevenueStats({ period })

  const stats = useMemo(() => {
    if (!data?.rows || data.rows.length === 0) return { total: 0, revenue: 0, rows: [] }
    
    // Get the most recent period's total
    const latest = data.rows[data.rows.length - 1]
    return {
      total: latest.invoiceCount,
      revenue: latest.totalRevenue,
      rows: data.rows
    }
  }, [data])

  // Helper to generate SVG path from rows
  const chartPath = useMemo(() => {
    if (!stats.rows || stats.rows.length < 2) return ""
    
    const width = 800
    const height = 150
    const maxVal = Math.max(...stats.rows.map(r => r.invoiceCount), 1)
    const stepX = width / (stats.rows.length - 1)
    
    return stats.rows.map((r, i) => {
      const x = i * stepX
      const y = height - (r.invoiceCount / maxVal) * height + 30
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }, [stats.rows])

  const areaPath = useMemo(() => {
    if (!chartPath) return ""
    return `${chartPath} L 800 180 L 0 180 Z`
  }, [chartPath])

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
            System Activity
          </p>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-primary leading-tight">
              {isLoading ? '...' : stats.total.toLocaleString()}
            </h3>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-mint-50 text-mint-600">
              {isLoading ? '' : formatPrice(stats.revenue)}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Total orders this {period === 'day' ? 'day' : period === 'month' ? 'month' : 'year'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-4 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 h-9 transition-colors hover:bg-neutral-100 cursor-pointer pr-8"
            >
              <option value="day">This Day</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
          </div>
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-400 border border-neutral-50 h-9 cursor-not-allowed">
            <span>All Services</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full">
        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="adminChartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line x1="0" y1="180" x2="800" y2="180" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="130" x2="800" y2="130" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="0" y1="30" x2="800" y2="30" stroke="#f1f5f9" strokeWidth="1" />

          {/* Dashed reference line - simplified for real data */}
          <path
            d="M 0 150 L 800 150"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.2"
          />
          {/* Area fill */}
          <path
            d={areaPath || "M 0 140 L 800 140"}
            fill="url(#adminChartGradient)"
            stroke="none"
          />
          {/* Main line */}
          <path
            d={chartPath || "M 0 140 L 800 140"}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tooltip dot */}
          <line
            x1="400"
            y1="20"
            x2="400"
            y2="180"
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <circle cx="400" cy="70" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
        </svg>
        <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2 font-primary opacity-60">
          <span>{data?.fromDate ? new Date(data.fromDate).toLocaleDateString('en-GB') : '---'}</span>
          <span>{data?.toDate ? new Date(data.toDate).toLocaleDateString('en-GB') : '---'}</span>
        </div>
      </div>
    </div>
  )
}
