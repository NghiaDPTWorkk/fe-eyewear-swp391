import React, { useState } from 'react'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import {
  IoTrendingUpOutline,
  IoBarChartOutline,
  IoBagHandleOutline,
  IoEyeOutline,
  IoSearchOutline,
  IoRefreshOutline,
  IoChevronDownOutline,
  IoEllipsisHorizontal
} from 'react-icons/io5'

// Custom Metric Card matching the image's style but with Manager theme
const ReportMetricCard: React.FC<{
  label: string
  value: string
  trend: { value: string; isPositive: boolean }
  icon: React.ReactNode
  subValue: string
}> = ({ label, value, trend, icon, subValue }) => (
  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <h3 className="text-2xl font-bold text-gray-900 font-primary">{value}</h3>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              trend.isPositive ? 'bg-mint-50 text-mint-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
        {icon}
      </div>
    </div>
    <div className="flex items-center justify-between">
      <p className="text-xs text-neutral-400 font-medium font-primary">
        <span className="font-semibold text-neutral-500">
          {trend.isPositive ? '+' : '-'}
          {subValue}
        </span>{' '}
        from last month
      </p>
      <button className="text-neutral-300 hover:text-mint-500 transition-colors">
        <IoEllipsisHorizontal size={14} />
      </button>
    </div>
  </div>
)

export default function ManagerReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock products
  const products = [
    { name: 'Rompi Berkancing', price: '$119.99', stock: 25, sold: 320, active: true },
    { name: 'Casual Blazer', price: '$89.50', stock: 12, sold: 150, active: true },
    { name: 'Silk Scarf', price: '$45.00', stock: 48, sold: 89, active: false },
    { name: 'Leather Boots', price: '$199.00', stock: 8, sold: 210, active: true }
  ]

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Sales Report"
        subtitle="Detailed analysis of your store's sales performance."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Reports' }]}
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
        <ReportMetricCard
          label="New Net Income"
          value="$53,765"
          trend={{ value: '10.5%', isPositive: true }}
          icon={<IoTrendingUpOutline size={20} />}
          subValue="$2,158"
        />
        <ReportMetricCard
          label="Average Sales"
          value="$12,680"
          trend={{ value: '3.4%', isPositive: true }}
          icon={<IoBarChartOutline size={20} />}
          subValue="$1,042"
        />
        <ReportMetricCard
          label="Total Order"
          value="11,294"
          trend={{ value: '0.5%', isPositive: false }}
          icon={<IoBagHandleOutline size={20} />}
          subValue="1,450"
        />
        <ReportMetricCard
          label="Impression"
          value="456K"
          trend={{ value: '15.2%', isPositive: false }}
          icon={<IoEyeOutline size={20} />}
          subValue="89.4K"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 px-4">
        {/* Overall Sales Chart */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-neutral-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1 leading-none">
                Overall Sales
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-primary leading-tight">
                  $83,125
                </h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-mint-50 text-mint-600">
                  ↑ 7.7%
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 h-9 transition-colors hover:bg-neutral-100">
                <span>All Products</span> <IoChevronDownOutline className="opacity-60" />
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 bg-neutral-50 rounded-xl text-[11px] font-semibold text-neutral-600 border border-neutral-100 h-9 transition-colors hover:bg-neutral-100">
                <span>All Categories</span> <IoChevronDownOutline className="opacity-60" />
              </button>
            </div>
          </div>

          <div className="relative h-64 w-full">
            <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ad7b0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4ad7b0" stopOpacity={0} />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="180" x2="800" y2="180" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="130" x2="800" y2="130" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="800" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="30" x2="800" y2="30" stroke="#f1f5f9" strokeWidth="1" />

              {/* Main Line */}
              <path
                d="M 0 150 Q 50 140 100 160 T 200 130 T 300 150 T 400 120 T 500 110 T 600 140 T 700 100 T 800 80"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <path
                d="M 0 140 Q 50 130 100 110 T 200 90 T 300 100 T 400 70 T 500 50 T 600 80 T 700 60 T 800 40"
                fill="url(#chartGradient)"
                stroke="none"
              />
              <path
                d="M 0 140 Q 50 130 100 110 T 200 90 T 300 100 T 400 70 T 500 50 T 600 80 T 700 60 T 800 40"
                fill="none"
                stroke="#4ad7b0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Tooltip vertical line */}
              <line
                x1="400"
                y1="20"
                x2="400"
                y2="180"
                stroke="#4ad7b0"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <circle cx="400" cy="70" r="6" fill="#4ad7b0" stroke="white" strokeWidth="2" />
            </svg>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-2 font-primary opacity-60">
              <span>Aug 01, 2024</span>
              <span>Aug 31, 2024</span>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
              Conversion Rate
            </h3>
            <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
              <IoBarChartOutline className="text-neutral-400" />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-3xl font-bold text-gray-900 font-primary leading-tight">4.55%</h4>
              <span className="text-[10px] font-semibold text-mint-600 bg-mint-50 px-1.5 py-0.5 rounded-full">
                ↑ 0.5%
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Product views', percent: '15%', value: '6,545' },
              { label: 'Add to cart', percent: '8%', value: '3,491' },
              { label: 'Checkout initiated', percent: '4%', value: '1,746' },
              { label: 'Completed purchases', percent: '2.75%', value: '1,200' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-gray-700 font-primary">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-mint-500 rounded-full transition-all duration-1000"
                    style={{ width: item.percent }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-tight">
                  {item.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
        {/* Upgrade Content */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between min-w-0 overflow-hidden">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-6 gap-2">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest whitespace-nowrap">
                Upgrade
              </span>
              <button className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-slate-900 transition-all shrink-0">
                Upgrade
              </button>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-primary leading-tight">
              Premium Plan
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-medium mb-8">
              Supercharge your sales management and unlock your full potential for extraordinary
              success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 min-w-0">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase mb-1 leading-none truncate">
                Performance
              </p>
              <p className="text-lg font-bold text-gray-900 font-primary">↑ 79%</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 min-w-0">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase mb-1 leading-none truncate">
                Tools
              </p>
              <p className="text-lg font-bold text-gray-900 font-primary">30+</p>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
                Product List
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-2xl font-bold text-gray-900 font-primary leading-none">
                  390
                </span>
                <span className="bg-mint-50 text-mint-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full tracking-tight">
                  +12
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
                  placeholder="Search product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all h-10"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-4 h-10 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-400 hover:text-mint-600 transition-colors">
                <IoRefreshOutline />
                <span className="md:hidden text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                  Refresh
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-primary">
              <thead className="bg-neutral-50/50 text-[10px] text-neutral-400 font-bold uppercase tracking-widest border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Sold</th>
                  <th className="px-6 py-4 text-center">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {products.map((p, idx) => (
                  <tr key={idx} className="group hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center text-neutral-400">
                          <IoBagHandleOutline size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-600">{p.price}</td>
                    <td className="px-6 py-4 text-xs font-medium text-neutral-600">{p.stock}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700">{p.sold}</td>
                    <td className="px-6 py-4 text-center">
                      <div
                        className={`w-8 h-4 rounded-full p-0.5 ml-auto mr-auto cursor-pointer transition-colors ${p.active ? 'bg-mint-500' : 'bg-neutral-200'}`}
                      >
                        <div
                          className={`w-3 h-3 bg-white rounded-full transition-transform ${p.active ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  )
}
