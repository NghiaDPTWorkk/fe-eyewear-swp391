import { Card } from '@/components'
import { IoEyeOutline } from 'react-icons/io5'

interface RxValues {
  sph: string
  cyl: string
  axis: string
  add: string
  pd: string
}

interface RxDataPanelProps {
  odData: RxValues
  osData: RxValues
  children?: React.ReactNode
}

function RxValueRow({
  data,
  label,
  variant
}: {
  data: RxValues
  label: string
  variant: 'od' | 'os'
}) {
  const isOd = variant === 'od'
  const bgClass = isOd
    ? 'bg-emerald-50/20 border-emerald-100/50'
    : 'bg-neutral-50/50 border-neutral-100'
  const labelClass = isOd ? 'text-emerald-800' : 'text-neutral-700'
  const headerClass = isOd ? 'text-emerald-700' : 'text-neutral-500'
  const valueClass = isOd
    ? 'border-emerald-200 text-emerald-900'
    : 'border-neutral-200 text-neutral-900'

  return (
    <div className={`p-4 rounded-xl border ${bgClass}`}>
      <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${labelClass}`}>
        <IoEyeOutline size={18} /> {label}
      </h4>
      <div className="grid grid-cols-5 gap-3 text-center">
        {(['sph', 'cyl', 'axis', 'add', 'pd'] as const).map((key) => (
          <div key={key}>
            <div className={`text-[10px] font-semibold uppercase mb-1 ${headerClass}`}>{key}</div>
            <div className={`bg-white border rounded-lg py-2 font-semibold ${valueClass}`}>
              {data[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RxDataPanel({ odData, osData, children }: RxDataPanelProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm flex flex-col">
      <div className="p-4 border-b border-neutral-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
          Customer Entered Data
        </h3>
      </div>
      <div className="p-6 space-y-6 flex-1">
        <RxValueRow data={odData} label="Right Eye (OD)" variant="od" />
        <RxValueRow data={osData} label="Left Eye (OS)" variant="os" />
      </div>
      {children}
    </Card>
  )
}
