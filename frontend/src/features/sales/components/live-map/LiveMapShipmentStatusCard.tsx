import { Card } from '@/components'
import { IoCube } from 'react-icons/io5'

interface ShipmentStatusCardProps {
  progress: number
}

export default function LiveMapShipmentStatusCard({ progress }: ShipmentStatusCardProps) {
  return (
    <Card className="col-span-2 p-6 rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">In Transit - On Schedule</h2>
          <p className="text-sm text-mint-600 font-medium">
            Arrived at Sort Facility - Tan Son Nhat Airport
          </p>
        </div>
        <IoCube className="text-mint-100 text-4xl" />
      </div>

      {}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
          <span>Milan (Start)</span>
          <span>Ho Chi Minh City (End)</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-mint-400 to-mint-600 rounded-full relative"
            style={{ width: `${progress}%`, transition: 'width 1s linear' }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col gap-2">
          <div className="h-1 w-full bg-mint-500 rounded-full"></div>
          <span className="text-xs font-bold text-gray-900">Order Placed</span>
          <span className="text-[10px] text-gray-400">Oct 22, 09:00</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-1 w-full bg-mint-500 rounded-full"></div>
          <span className="text-xs font-bold text-gray-900">Exported</span>
          <span className="text-[10px] text-gray-400">Oct 23, 16:20</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-1 w-full bg-mint-500 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
          </div>
          <span className="text-xs font-bold text-mint-600">Importing</span>
          <span className="text-[10px] text-mint-500 font-medium">In Progress...</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-1 w-full bg-gray-200 rounded-full"></div>
          <span className="text-xs font-medium text-gray-400">Delivered</span>
          <span className="text-[10px] text-gray-300">--</span>
        </div>
      </div>
    </Card>
  )
}
