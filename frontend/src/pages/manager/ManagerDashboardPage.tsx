import { useState, useMemo } from 'react'
import {
  IoTrendingUpOutline,
  IoSwapHorizontalOutline,
  IoBarChartOutline,
  IoRefreshOutline,
  IoArrowBackCircleOutline
} from 'react-icons/io5'

import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { useRevenueStats, useReturnedOrders, useTopSalesStats } from '@/features/manager/hooks'
import { useOrderTypeStats } from '@/features/sales/hooks'
import { formatPrice, formatDate } from '@/shared/utils'

import { StatCard } from './components/dashboard/StatCard'
import { CustomerGrowth } from './components/dashboard/CustomerGrowth'
import { PopularProducts } from './components/dashboard/PopularProducts'

export default function ManagerDashboardPage() {
  const [period, setPeriod] = useState<string>('month')

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const { data: revenueData, isLoading: isRevenueLoading } = useRevenueStats({ period })
  const { data: returnedData, isLoading: isReturnedLoading } = useReturnedOrders({ search: '' })
  const { data: topSalesData, isLoading: isTopSalesLoading } = useTopSalesStats(
    currentMonth,
    currentYear
  )
  const { stats: orderStats } = useOrderTypeStats()

  const stats = useMemo(() => {
    if (!revenueData?.rows || revenueData.rows.length === 0)
      return { totalRevenue: 0, totalInvoices: 0, avgValue: 0 }

    const latestRow = revenueData.rows[revenueData.rows.length - 1]
    const totalRevenue = latestRow.totalRevenue
    const totalInvoices = latestRow.invoiceCount
    const avgValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

    return { totalRevenue, totalInvoices, avgValue }
  }, [revenueData])

  const revenueOverviewTitle = useMemo(() => {
    return period === 'week' ? 'Revenue Overview This Week' : 'Revenue Overview This Month'
  }, [period])

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

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Manager Dashboard"
        subtitle="Comprehensive overview of store performance, sales reports, and customer activity."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Top Section: Dynamic Stats Cards Dàn Ngang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          variant="mint"
          icon={<IoTrendingUpOutline />}
          trend={{ value: 'This Month', isPositive: true }}
        />
        <StatCard
          label="Total Invoices"
          value={orderStats?.total.toString() || stats.totalInvoices.toString()}
          icon={<IoSwapHorizontalOutline />}
          trend={{ value: 'Global Count', isPositive: true }}
        />
        <StatCard
          label="Avg. Order"
          value={formatPrice(stats.avgValue)}
          icon={<IoBarChartOutline />}
          trend={{ value: 'This Month', isPositive: true }}
        />
        <StatCard
          label="Total Returns"
          value={returnedData?.pagination.total.toString() || '0'}
          icon={<IoRefreshOutline />}
          trend={{ value: 'All Time', isPositive: false }}
        />
      </div>

      {/* Main Content Section: Dynamic Sales Report Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Revenue Chart Component */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1 leading-none">
                {revenueOverviewTitle}
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
              {['week', 'month'].map((p) => (
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
                  <p className="text-[11px] font-semibold text-amber-700 mt-1">
                    Refund: {formatPrice(item.returnTicket.money || 0)}
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
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <CustomerGrowth stats={topSalesData} isLoading={isTopSalesLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <PopularProducts stats={topSalesData} isLoading={isTopSalesLoading} />
        </div>
      </div>
    </Container>
  )
}
