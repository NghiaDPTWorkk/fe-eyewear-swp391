import React, { useMemo } from 'react'
import { useRevenueStats } from '@/features/manager/hooks/useRevenueStats'
import { formatPrice } from '@/shared/utils/format.utils'

interface SystemOverviewProps {
  period: string
  fromDate: string
  toDate: string
  year: number
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ period, fromDate, toDate, year }) => {
  // Sync params based on received props
  const dateParams = React.useMemo(() => {
    if (period === 'year') return { period, year }
    if (period === 'day') return { period }
    return { fromDate, toDate }
  }, [period, fromDate, toDate, year])

  const { data, isLoading } = useRevenueStats(dateParams)

  const stats = useMemo(() => {
    if (!data?.rows || data.rows.length === 0) return { total: 0, revenue: 0, rows: [] }
    
    // Sum up totals from all rows in the range
    const totalOrders = data.rows.reduce((sum, r) => sum + r.invoiceCount, 0)
    const totalRev = data.rows.reduce((sum, r) => sum + r.totalRevenue, 0)
    
    return {
      total: totalOrders,
      revenue: totalRev,
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
            <span className="text-[10px] font-bold text-mint-600 opacity-60 ml-1">
              ↑ 12.3%
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Total activity for the selected {period === 'day' ? 'day' : period === 'month' ? 'range' : 'year'}
          </p>
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

          {/* Tooltip dot (centered for now) */}
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
