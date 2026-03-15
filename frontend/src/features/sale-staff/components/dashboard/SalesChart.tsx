import { Card } from '@/shared/components'

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
  )
}

export default function SalesChart() {
  return (
    <Card className="lg:col-span-2 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sales this year</h3>
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
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-px bg-gray-50" />
          ))}
        </div>

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
          <path
            d="M0 250 C 200 200, 400 280, 600 150 S 800 100, 1000 120 L 1200 20 L 1200 300 L 0 300 Z"
            fill="url(#sales-chart-gradient-green)"
            opacity="0.1"
          />
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

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-500">
          <p className="text-xs text-gray-500">Average sale value</p>
          <p className="text-xl font-semibold text-emerald-500">$339,091</p>
        </div>

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
