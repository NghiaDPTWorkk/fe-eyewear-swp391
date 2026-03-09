import React, { useState, useMemo } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import {
  IoTrendingUpOutline,
  IoBarChartOutline,
  IoBagHandleOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoArrowBackCircleOutline,
  IoSearchOutline
} from 'react-icons/io5'
import { useRevenueStats, useReturnedOrders } from '@/features/manager/hooks/useManagerReports'
import { formatPrice, formatDate } from '@/shared/utils'

const ManagerReportMetricCard: React.FC<{
  label: string
  value: string | number
  trend?: { value: string; isPositive: boolean }
  icon: React.ReactNode
  subValue?: string
  iconBg?: string
}> = ({ label, value, trend, icon, subValue, iconBg = 'bg-mint-50 text-mint-700' }) => (
  <div className="bg-white p-6 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 transition-all hover:shadow-md group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[12px] font-bold text-slate-400 tracking-wider whitespace-nowrap uppercase">
          {label}
        </p>
        <h3 className="text-2xl font-bold mt-1.5 text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div
        className={`p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${iconBg}`}
      >
        {icon}
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={`font-bold flex items-center ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {trend.isPositive ? '↗' : '↘'} {trend.value}
        </span>
        <span className="text-gray-500">
          <span className={trend.isPositive ? 'text-emerald-600' : 'text-red-600'}>
            {trend.isPositive ? '+' : '-'}
            {subValue}
          </span>{' '}
          from last period
        </span>
      </div>
    )}
  </div>
)

export default function ManagerReportsPage() {
  const [period, setPeriod] = useState<string>('month')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: revenueData,
    isLoading: isRevenueLoading,
    refetch: refetchRevenue
  } = useRevenueStats({ period })
  const {
    data: returnedData,
    isLoading: isReturnedLoading,
    refetch: refetchReturned
  } = useReturnedOrders({ search: searchQuery })

  const stats = useMemo(() => {
    if (!revenueData?.rows) return { totalRevenue: 0, totalInvoices: 0, avgValue: 0 }
    const totalRevenue = revenueData.rows.reduce((acc, row) => acc + row.totalRevenue, 0)
    const totalInvoices = revenueData.rows.reduce((acc, row) => acc + row.invoiceCount, 0)
    const avgValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0
    return { totalRevenue, totalInvoices, avgValue }
  }, [revenueData])

  const chartInfo = useMemo(() => {
    if (!revenueData?.rows?.length) return { path: '', area: '', points: [], maxHex: 0 }
    const rows = revenueData.rows
    const maxVal = Math.max(...rows.map((r) => r.totalRevenue), 1)

    const points = rows.map((row, i) => {
      const x = rows.length > 1 ? (i / (rows.length - 1)) * 800 : 400
      const y = 180 - (row.totalRevenue / maxVal) * 150
      return { x, y, ...row }
    })

    if (points.length === 0) return { path: '', area: '', points: [], maxHex: 0 }
    if (points.length === 1) {
      return {
        path: `M 0 ${points[0].y} L 800 ${points[0].y}`,
        area: `M 0 ${points[0].y} L 800 ${points[0].y} L 800 180 L 0 180 Z`,
        points,
        maxHex: maxVal
      }
    }

    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }

    const area = `${path} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`

    return { path, area, points, maxHex: maxVal }
  }, [revenueData])

  const handleRefresh = () => {
    refetchRevenue()
    refetchReturned()
  }

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Sales Report"
        subtitle="Detailed analysis of your store's sales performance and return requests."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Reports' }]}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ManagerReportMetricCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<IoTrendingUpOutline size={20} />}
          iconBg="bg-mint-50 text-mint-700"
        />
        <ManagerReportMetricCard
          label="Total Orders"
          value={stats.totalInvoices}
          icon={<IoBagHandleOutline size={20} />}
          iconBg="bg-orange-50 text-orange-600"
        />
        <ManagerReportMetricCard
          label="Avg. Order Value"
          value={formatPrice(stats.avgValue)}
          icon={<IoBarChartOutline size={20} />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1 leading-none">
                Revenue Overview
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {formatPrice(stats.totalRevenue)}
                </h3>
                <span className="text-[10px] font-semibold text-neutral-400">
                  {revenueData?.fromDate ? formatDate(revenueData.fromDate) : ''} -{' '}
                  {revenueData?.toDate ? formatDate(revenueData.toDate) : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {['day', 'week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    period === p
                      ? 'bg-mint-600 text-white shadow-lg shadow-mint-100'
                      : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100 border border-neutral-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-64 w-full">
            {isRevenueLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
              </div>
            ) : null}

            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ad7b0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4ad7b0" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              {[30, 80, 130, 180].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={y === 180 ? '0' : '4 4'}
                />
              ))}

              {/* Area & Line */}
              {chartInfo.path && (
                <>
                  <path d={chartInfo.area} fill="url(#chartGradient)" stroke="none" />
                  <path
                    d={chartInfo.path}
                    fill="none"
                    stroke="#4ad7b0"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {chartInfo.points.map((p, i) => (
                    <g key={i} className="group/point">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#4ad7b0"
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all group-hover/point:r-6 cursor-pointer"
                      />
                      <title>{`${p.period}: ${formatPrice(p.totalRevenue)}`}</title>
                    </g>
                  ))}
                </>
              )}
            </svg>

            {!isRevenueLoading && chartInfo.points.length > 0 && (
              <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 tracking-widest uppercase opacity-60">
                <span>{chartInfo.points[0].period}</span>
                <span>{chartInfo.points[chartInfo.points.length - 1].period}</span>
              </div>
            )}
          </div>
        </div>

        {/* Return Summary Card */}
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase leading-none">
              Return Requests
            </p>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
              <IoArrowBackCircleOutline size={18} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-2xl font-bold text-slate-900 tracking-tight">
                {returnedData?.pagination.total || 0}
              </h4>
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Total Returns
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Recently processed or pending returns.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 scroller-hide">
            {isReturnedLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : returnedData?.returnedOrders.length === 0 ? (
              <p className="text-xs text-center text-slate-300 font-medium py-10 italic">
                No returned orders yet
              </p>
            ) : (
              returnedData?.returnedOrders.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group hover:border-amber-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      #RT-{item.returnTicket.id.slice(-6)}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">
                      {item.returnTicket.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {item.returnTicket.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {formatDate(item.returnTicket.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Returned Orders Table List */}
        <div className="lg:col-span-12 bg-white rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Returned Orders Details
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  {returnedData?.pagination.total || 0}
                </span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">
                  Entries
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <IoSearchOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by reason or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all h-10"
                />
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center justify-center gap-2 px-4 h-10 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-colors active:scale-95"
              >
                <IoRefreshOutline
                  className={isRevenueLoading || isReturnedLoading ? 'animate-spin' : ''}
                />
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                  Refresh
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50/50">
                <tr>
                  <th className="px-6 py-5">Ticket ID</th>
                  <th className="px-6 py-5">Reason</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {isReturnedLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="w-8 h-8 mx-auto border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
                    </td>
                  </tr>
                ) : (returnedData?.returnedOrders.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-300 italic text-sm">
                      No returned records found.
                    </td>
                  </tr>
                ) : (
                  returnedData?.returnedOrders.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-6 font-primary">
                        <span className="text-sm font-semibold text-gray-900 leading-none">
                          #RT-{item.returnTicket.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="max-w-xs">
                          <p className="text-sm font-semibold text-gray-700 leading-none mb-1.5 line-clamp-1">
                            {item.returnTicket.reason}
                          </p>
                          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-tight truncate">
                            {item.returnTicket.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.returnTicket.money)}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">
                          <IoCalendarOutline size={12} className="text-neutral-300" />
                          {formatDate(item.returnTicket.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100 italic">
                          {item.returnTicket.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  )
}
