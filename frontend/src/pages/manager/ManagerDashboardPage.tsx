import { useState, useMemo } from 'react'
import {
  IoTrendingUpOutline,
  IoSwapHorizontalOutline,
  IoBarChartOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoSearchOutline,
  IoArrowBackCircleOutline
} from 'react-icons/io5'

import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useRevenueStats, useReturnedOrders } from '@/features/manager/hooks'
import { formatPrice, formatDate } from '@/shared/utils'

import { SalesTarget } from './components/dashboard/SalesTarget'
import { StatCard } from './components/dashboard/StatCard'
import { PromoBanner } from './components/dashboard/PromoBanner'
import { CustomerGrowth } from './components/dashboard/CustomerGrowth'
import { PopularProducts } from './components/dashboard/PopularProducts'

export default function ManagerDashboardPage() {
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
        title="Manager Dashboard"
        subtitle="Comprehensive overview of store performance, sales reports, and customer activity."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Top Section: Sales Target & Dynamic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SalesTarget />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            label="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            variant="mint"
            icon={<IoTrendingUpOutline />}
            trend={{ value: 'Real-time', isPositive: true }}
          />
          <StatCard
            label="Total Invoices"
            value={stats.totalInvoices.toString()}
            icon={<IoSwapHorizontalOutline />}
            trend={{ value: 'Updated', isPositive: true }}
          />
          <StatCard
            label="Avg. Order"
            value={formatPrice(stats.avgValue)}
            icon={<IoBarChartOutline />}
          />
          <StatCard
            label="Total Returns"
            value={returnedData?.pagination.total.toString() || '0'}
            icon={<IoRefreshOutline />}
          />
        </div>
      </div>

      {/* Main Content Section: Dynamic Sales Report Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Revenue Chart Component */}
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
            {isRevenueLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="w-8 h-8 border-4 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
              </div>
            )}

            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ad7b0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4ad7b0" stopOpacity={0} />
                </linearGradient>
              </defs>
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

              {chartInfo.path && (
                <>
                  <path d={chartInfo.area} fill="url(#dashboardGradient)" stroke="none" />
                  <path
                    d={chartInfo.path}
                    fill="none"
                    stroke="#4ad7b0"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {chartInfo.points.map((p, i) => (
                    <g key={i} className="group/point">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#4ad7b0"
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all hover:r-6 cursor-pointer"
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

        {/* Dynamic Return Requests Sidebar Integration */}
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase leading-none">
              Active Returns
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
                Returns
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Recent return activity in your store.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 scroller-hide">
            {isReturnedLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : returnedData?.returnedOrders.length === 0 ? (
              <p className="text-xs text-center text-slate-300 font-medium py-10 italic">
                No active returns
              </p>
            ) : (
              returnedData?.returnedOrders.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group hover:border-amber-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      #RT-{item.returnTicket.id.slice(-6).toUpperCase()}
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

      {/* Middle Section: Original Dashboard Components */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <PromoBanner />
        </div>
        <div className="lg:col-span-3">
          <CustomerGrowth />
        </div>
      </div>

      {/* Bottom Section: Dynamic Returns Table & Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase leading-none">
                Sales Performance Logs
              </p>
              <p className="text-[10px] font-bold text-neutral-300 uppercase mt-2 tracking-widest">
                Latest 10 transactions and returns
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <IoSearchOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-mint-500/20 w-48 transition-all"
                />
              </div>
              <button
                onClick={handleRefresh}
                className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-all hover:bg-neutral-100"
              >
                <IoRefreshOutline
                  className={isRevenueLoading || isReturnedLoading ? 'animate-spin' : ''}
                />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-[10px] text-neutral-400 font-bold tracking-widest uppercase border-b border-neutral-50/50">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Reason/Label</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {isReturnedLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="w-6 h-6 mx-auto border-2 border-mint-200 border-t-mint-600 rounded-full animate-spin" />
                    </td>
                  </tr>
                ) : (
                  returnedData?.returnedOrders.slice(0, 10).map((item, idx) => (
                    <tr key={idx} className="group hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-900 uppercase">
                          #RT-{item.returnTicket.id.slice(-6)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-semibold text-slate-700">
                          {item.returnTicket.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-900">
                          {formatPrice(item.returnTicket.money)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <IoCalendarOutline size={12} />
                          {formatDate(item.returnTicket.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
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
        <div className="lg:col-span-4">
          <PopularProducts />
        </div>
      </div>
    </Container>
  )
}
