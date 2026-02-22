import React from 'react'
import { IoChevronForward } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui-core'

interface LabOrder {
  id: string
  type: string
  material: string
  station: string
  stationColor: string
  progress: number
  progressColor: string
  time: string
  urgency: string
  urgencyColor: string
}

interface ActiveLabOrdersTableProps {
  orders: LabOrder[]
}

export const ActiveLabOrdersTable: React.FC<ActiveLabOrdersTableProps> = ({ orders }) => {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-100 shadow-sm rounded-2xl bg-white">
      <div className="px-8 py-5 border-b border-neutral-100 flex justify-between items-center bg-white">
        <h3 className="text-[11px] font-semibold text-[#a4a9c1] uppercase tracking-widest">
          Active Lab Orders
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
          <span className="text-[11px] font-semibold text-[#a4a9c1] uppercase tracking-widest">
            Urgency Requested
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-neutral-100">
              <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest align-middle">
                Order ID
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest align-middle">
                Lens Type
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest text-center align-middle">
                Lab Station
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest text-center align-middle">
                Progress
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest text-center align-middle">
                Time in Stn.
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest text-center align-middle">
                Urgency
              </th>
              <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] tracking-widest text-right align-middle">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {orders.map((order, idx) => (
              <tr
                key={idx}
                className="hover:bg-neutral-50/50 transition-colors cursor-pointer group"
              >
                <td className="pl-10 px-6 py-6 font-primary">
                  <span className="text-sm font-bold text-neutral-800 tracking-tight">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-6 font-primary">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 truncate leading-none mb-1">
                      {order.type}
                    </p>
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
                      {order.material}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ring-1 ring-inset ring-neutral-200/50 ${order.stationColor}`}
                  >
                    {order.station}
                  </span>
                </td>
                <td className="px-6 py-6 text-center min-w-[140px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden border border-neutral-200/50">
                      <div
                        className={`h-full ${order.progressColor} transition-all duration-500 rounded-full relative`}
                        style={{ width: `${order.progress}%` }}
                      >
                        <div className="absolute top-0 right-0 w-4 h-full bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500 font-mono tracking-tighter">
                      {order.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center font-primary">
                  <span className="text-sm font-bold text-neutral-600 font-mono tabular-nums">
                    {order.time}
                  </span>
                </td>
                <td className="px-6 py-6 text-center font-primary">
                  <span
                    className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${order.urgencyColor}`}
                  >
                    {order.urgency}
                  </span>
                </td>
                <td className="pr-10 px-6 py-6 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="neutral"
                    className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all active:scale-90"
                  >
                    <IoChevronForward size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
