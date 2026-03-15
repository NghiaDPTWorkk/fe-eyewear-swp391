import { Card } from '@/components'
import { IoChevronForward } from 'react-icons/io5'

const LAB_ORDERS = [
  {
    id: '#ORD-7352',
    type: 'Progressive Digital',
    material: 'HI 1.67 • AR Coating',
    station: 'Coating',
    stationColor: 'bg-blue-100 text-blue-600',
    progress: 75,
    progressColor: 'bg-blue-400',
    time: '00:45:12',
    urgency: 'Normal',
    urgencyColor: 'bg-neutral-100 text-neutral-500'
  },
  {
    id: '#ORD-7351',
    type: 'Single Vision',
    material: 'Polycarb • Scratch Resist',
    station: 'Grinding',
    stationColor: 'bg-purple-100 text-purple-600',
    progress: 30,
    progressColor: 'bg-purple-400',
    time: '00:12:05',
    urgency: 'Urgent',
    urgencyColor: 'bg-orange-100 text-orange-600'
  },
  {
    id: '#ORD-7350',
    type: 'Bifocal Flat Top',
    material: 'CR-39 • Tinted',
    station: 'QC Check',
    stationColor: 'bg-emerald-100 text-emerald-600',
    progress: 90,
    progressColor: 'bg-emerald-400',
    time: '00:05:30',
    urgency: 'Normal',
    urgencyColor: 'bg-neutral-100 text-neutral-500'
  },
  {
    id: '#ORD-7349',
    type: 'Progressive Standard',
    material: 'Trivex • Transitions',
    station: 'Polishing',
    stationColor: 'bg-amber-100 text-amber-600',
    progress: 55,
    progressColor: 'bg-amber-400',
    time: '02:15:00',
    urgency: 'Late',
    urgencyColor: 'bg-red-100 text-red-600'
  }
]

export default function OrdersTable() {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-100 shadow-sm rounded-2xl">
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
              <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Order ID
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Lens Type
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Lab Station
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Progress
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Time in Stn.
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Urgency
              </th>
              <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-right align-middle">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {LAB_ORDERS.map((order, idx) => (
              <tr key={idx} className="hover:bg-emerald-50/30 transition-all cursor-pointer group">
                <td className="pl-10 px-6 py-6 align-middle">
                  <div className="text-sm font-medium text-emerald-500 group-hover:text-emerald-600 transition-colors">
                    {order.id}
                  </div>
                  <div className="text-[11px] text-[#a4a9c1] font-medium">Progressive Digital</div>
                </td>
                <td className="px-6 py-6">
                  <div className="text-sm font-semibold text-[#3d4465] mb-0.5 group-hover:text-emerald-700 transition-colors">
                    {order.type}
                  </div>
                  <div className="text-[11px] text-[#a4a9c1] font-medium uppercase tracking-wider">
                    {order.material}
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border shadow-sm bg-white ${order.stationColor.replace('bg-', 'text-').replace('text-', 'border-')}`}
                  >
                    {order.station}
                  </span>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${order.progressColor}`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#3d4465]">
                      {order.progress}%
                    </span>
                  </div>
                </td>
                <td
                  className={`px-6 py-6 text-sm font-medium text-center ${order.urgency === 'Late' ? 'text-red-500' : 'text-[#3d4465]'}`}
                >
                  {order.time}
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold uppercase tracking-widest shadow-sm bg-white ${order.urgencyColor.replace('bg-', 'text-').replace('text-', 'border-')}`}
                    >
                      {order.urgency}
                    </span>
                  </div>
                </td>
                <td className="pr-10 px-6 py-6 text-right">
                  <button className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl">
                    <IoChevronForward size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-6 flex justify-between items-center text-xs font-semibold text-[#a4a9c1] bg-white border-t border-neutral-100">
        <span className="opacity-70">Showing 1 to 4 of 42 active orders</span>
        <div className="flex gap-3">
          <button className="px-6 py-2 border border-neutral-200 rounded-lg text-sm font-semibold text-[#3d4465] hover:bg-neutral-50 transition-colors bg-white">
            Previous
          </button>
          <button className="px-6 py-2 border border-neutral-200 rounded-lg text-sm font-semibold text-[#3d4465] hover:bg-neutral-50 transition-colors bg-white">
            Next
          </button>
        </div>
      </div>
    </Card>
  )
}
