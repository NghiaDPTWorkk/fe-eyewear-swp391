/**
 * ProductMetrics Component
 * Displays product-related KPI metrics
 */
interface Metric {
  title: string
  value: string
  trend: string
  trendColor?: string
  subtext: string
}

const METRICS: Metric[] = [
  { title: 'Total Products', value: '1,240', trend: '+12%', subtext: '+48 from last month' },
  {
    title: 'Low Stock Items',
    value: '12',
    trend: '+5%',
    trendColor: 'text-rose-500 bg-rose-50',
    subtext: '+2 compared to last week'
  },
  {
    title: 'Out of Stock',
    value: '6',
    trend: '-2%',
    trendColor: 'text-emerald-500 bg-emerald-50',
    subtext: '-3 compared to yesterday'
  },
  { title: 'Avg. Profit Margin', value: '42%', trend: '+0.5%', subtext: '+2% from last year' }
]

export default function ProductMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pt-6">
      {METRICS.map((m, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-none">
          <div className="text-sm font-medium text-neutral-500 mb-4">{m.title}</div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-neutral-800">{m.value}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${m.trendColor || 'text-emerald-500 bg-emerald-50'}`}
            >
              {m.trend}
            </span>
          </div>
          <div className="text-xs text-neutral-400 font-medium">{m.subtext}</div>
        </div>
      ))}
    </div>
  )
}
