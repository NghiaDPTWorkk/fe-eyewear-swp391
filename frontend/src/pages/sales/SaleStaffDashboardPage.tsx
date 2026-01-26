import { Container } from '@/shared/components/ui/container'
import { MetricCard } from '@/shared/components/ui/metric-card'
import { Card } from '@/shared/components/ui/card'
import OrderTable from '@/features/staff/components/OrderTable/OrderTable'
import {
  IoClipboardOutline,
  IoWalletOutline,
  IoTicketOutline,
  IoFlagOutline,
  IoFilter,
  IoAdd
} from 'react-icons/io5'

// --- Constants ---
const METRICS = [
  {
    title: 'Pending Orders',
    value: '24',
    icon: <IoClipboardOutline className="text-2xl" />,
    trend: { label: 'from yesterday', value: 12, isPositive: true },
    progress: { value: 45, colorClass: 'bg-orange-500' },
    colorScheme: 'warning' as const
  },
  {
    title: 'Daily Revenue',
    value: '$4,250.00',
    icon: <IoWalletOutline className="text-2xl" />,
    trend: { label: 'vs last week', value: 8.2, isPositive: true },
    progress: { value: 70, colorClass: 'bg-emerald-500' },
    colorScheme: 'success' as const
  },
  {
    title: 'Open Tickets',
    value: '5',
    icon: <IoTicketOutline className="text-2xl" />,
    trend: { label: 'new today', value: -2, isPositive: false },
    progress: { value: 25, colorClass: 'bg-red-500' },
    colorScheme: 'danger' as const
  },
  {
    title: 'Monthly Target',
    value: '85%',
    subValue: '$102k achieved',
    icon: <IoFlagOutline className="text-2xl" />,
    trend: null,
    progress: { value: 85, colorClass: 'bg-blue-600' },
    colorScheme: 'primary' as const
  }
]

const ORDER_STATUSES = [
  { label: 'Completed', val: '65%', color: 'bg-emerald-500', hex: '#10B981' },
  { label: 'Processing', val: '25%', color: 'bg-blue-500', hex: '#3B82F6' },
  { label: 'Pending', val: '10%', color: 'bg-orange-500', hex: '#F97316' }
]

// --- Sub Components ---

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  )
}

function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {METRICS.map((metric, index) => (
        <MetricCard
          key={index}
          label={metric.title}
          value={metric.value}
          subValue={metric.subValue}
          trend={metric.trend as any}
          icon={metric.icon}
          colorScheme={metric.colorScheme}
          progress={metric.progress}
        />
      ))}
    </div>
  )
}

function SalesChart() {
  return (
    <Card className="lg:col-span-2 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sales this year</h3>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <LegendItem color="bg-emerald-400" label="Frames" />
            <LegendItem color="bg-blue-500" label="Lenses" />
          </div>
        </div>
        <button className="px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          Show All
        </button>
      </div>

      <div className="relative h-75 w-full border-b border-l border-gray-100 mt-4">
        {/* Background Grid */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-px bg-gray-50" />
          ))}
        </div>

        {/* SVG Chart */}
        <svg
          className="absolute inset-0 w-full h-full pb-6 pl-2"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          viewBox="0 0 1200 300"
        >
          <defs>
            <linearGradient id="sales-chart-gradient-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Gradient Fill */}
          <path
            d="M0 250 C 200 200, 400 280, 600 150 S 800 100, 1000 120 L 1200 20 L 1200 300 L 0 300 Z"
            fill="url(#sales-chart-gradient-green)"
            opacity="0.1"
          />
          {/* Lines */}
          <path
            d="M0 250 C 200 200, 400 280, 600 150 S 800 100, 1200 20"
            fill="none"
            stroke="#34D399"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0 280 C 200 260, 400 290, 600 220 S 800 180, 1200 120"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Tooltip */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-500">
          <p className="text-xs text-gray-500">Average sale value</p>
          <p className="text-xl font-bold text-emerald-500">$339,091</p>
        </div>

        {/* X Axis */}
        <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400 pt-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
            (m) => (
              <span key={m}>{m}</span>
            )
          )}
        </div>
      </div>
    </Card>
  )
}

function OrderStatusChart() {
  return (
    <Card className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Order Status</h3>
        <span className="text-gray-400 cursor-pointer">•••</span>
      </div>

      <div className="relative flex-1 min-h-62.5 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full order-status-gradient">
          <div className="absolute inset-0 m-auto w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-bold text-gray-900">1,240</span>
            <span className="text-sm text-gray-500 font-medium">Total Orders</span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {ORDER_STATUSES.map((item) => (
          <div key={item.label} className="flex justify-between items-center text-sm">
            <LegendItem color={item.color} label={item.label} />
            <span className="font-medium text-gray-900">{item.val}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function UrgentOrdersTable() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Urgent Orders</h3>
          <p className="text-sm text-gray-500">Orders requiring immediate attention.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <IoFilter /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 shadow-sm shadow-emerald-200">
            <IoAdd /> New Order
          </button>
        </div>
      </div>

      <OrderTable />
    </Card>
  )
}

// --- Main Page Component ---

export default function SaleStaffDashboardPage() {
  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-primary-500 font-bold">Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Overview</h1>
        <p className="text-gray-500 mt-1">
          Overview of store performance and daily sales operations.
        </p>
      </div>

      <DashboardMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusChart />
        </div>
      </div>

      <UrgentOrdersTable />
    </Container>
  )
}
