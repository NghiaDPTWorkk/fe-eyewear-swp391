import { Card } from '@/shared/components/ui/card'

const ORDER_STATUSES = [
  { label: 'Completed', val: '65%', color: 'bg-emerald-500' },
  { label: 'Processing', val: '25%', color: 'bg-blue-500' },
  { label: 'Pending', val: '10%', color: 'bg-orange-500' }
]

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  )
}

export default function OrderStatusChart() {
  return (
    <Card className="p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
        <span className="text-gray-400 cursor-pointer">•••</span>
      </div>

      <div className="relative flex-1 min-h-62.5 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full order-status-gradient">
          <div className="absolute inset-0 m-auto w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-semibold text-gray-900">1,240</span>
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
