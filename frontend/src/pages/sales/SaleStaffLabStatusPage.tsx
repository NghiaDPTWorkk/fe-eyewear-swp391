import { Container, Card, Button } from '@/components'
import {
  IoSearchOutline,
  IoFilter,
  IoRefresh,
  IoFlaskOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoNotificationsOutline,
  IoMailOutline
} from 'react-icons/io5'

export default function SaleStaffLabStatusPage() {
  const labOrders = [
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

  return (
    <Container>
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-lg">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, station, or lens type..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/20"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <IoMailOutline className="text-xl text-neutral-400 cursor-pointer" />
            <IoNotificationsOutline className="text-xl text-neutral-400 cursor-pointer" />
          </div>
          <div className="text-sm font-medium text-neutral-600">Oct 24, 2023</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lab Status Tracking</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Monitor production stages, urgent requests, and lens specifications.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-neutral-100 shadow-sm">
            <Button
              size="sm"
              variant="ghost"
              colorScheme="neutral"
              rightIcon={<IoFilter />}
              className="text-neutral-500 px-3"
            >
              All Urgencies
            </Button>
            <div className="w-px h-6 bg-neutral-100"></div>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="neutral"
              rightIcon={<IoFilter />}
              className="text-neutral-500 px-3"
            >
              All Stations
            </Button>
          </div>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoRefresh />}
            className="rounded-xl font-bold px-4"
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Metric Cards Left Side */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-4 border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                In Production
              </p>
              <h3 className="text-2xl font-bold text-neutral-900 mt-1">42</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <IoFlaskOutline size={20} />
            </div>
          </Card>
          <Card className="p-4 border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Urgent / Late
              </p>
              <h3 className="text-2xl font-bold text-neutral-900 mt-1">8</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <IoWarningOutline size={20} />
            </div>
          </Card>
          <Card className="p-4 border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Ready for QC
              </p>
              <h3 className="text-2xl font-bold text-neutral-900 mt-1">12</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg">
              <IoCheckmarkCircleOutline size={20} />
            </div>
          </Card>
        </div>

        {/* Lens Specifications Main Card */}
        <Card className="col-span-12 lg:col-span-9 p-6 border border-neutral-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-emerald-100 text-emerald-600 rounded">
                <IoCheckmarkCircleOutline size={16} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Lens Specifications{' '}
                <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded uppercase tracking-wider">
                  Selected: #ORD-7352
                </span>
              </h3>
            </div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider italic">
              Read-Only View
            </span>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-2 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Lens Type
                </p>
                <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
                  Progressive Digital Freeform
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Material
                </p>
                <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
                  High Index 1.67
                </div>
              </div>
            </div>

            <div className="col-span-1 border-x border-neutral-100 px-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
                  Sphere (SPH)
                </p>
                <div className="flex gap-2 justify-center">
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      OD
                    </span>
                    <div className="text-sm font-bold text-neutral-900">-2.50</div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      OS
                    </span>
                    <div className="text-sm font-bold text-neutral-900">-2.75</div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
                  Cylinder (CYL)
                </p>
                <div className="flex gap-2 justify-center">
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      OD
                    </span>
                    <div className="text-sm font-bold text-neutral-900">-0.50</div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                      OS
                    </span>
                    <div className="text-sm font-bold text-neutral-900">-0.75</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Lab Notes
                </p>
                <div className="p-3 bg-amber-50 rounded-lg text-[11px] font-medium text-amber-800 leading-relaxed border border-amber-100">
                  Customer requested rush delivery if possible. Careful with frame alignment, known
                  sensitive fit.
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Coating
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">
                    Anti-Reflective
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">
                    Blue Light Filter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-100 shadow-sm">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-white">
          <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Active Lab Orders
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Urgency Requested
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Lens Type
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Lab Station
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Time in Stn.
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {labOrders.map((order, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-neutral-50/30 transition-colors ${idx === 0 ? 'bg-emerald-50/20' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-bold text-neutral-900 border-l-2 border-transparent">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-neutral-800">{order.type}</div>
                    <div className="text-[10px] text-neutral-400 font-medium">{order.material}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.stationColor}`}
                    >
                      {order.station}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${order.progressColor}`}
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-neutral-600">
                        {order.progress}%
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 text-xs font-mono font-bold ${order.urgency === 'Late' ? 'text-red-600' : 'text-neutral-500'}`}
                  >
                    {order.time}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.urgencyColor}`}
                    >
                      {order.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="primary"
                      className="text-[9px] font-bold uppercase tracking-widest h-7 px-3 border border-primary-500/20 hover:bg-primary-50"
                    >
                      Request Urgent
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-neutral-100 flex justify-between items-center text-xs font-medium text-neutral-400 bg-neutral-50/30">
          <span>Showing 1 to 4 of 42 active orders</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              colorScheme="neutral"
              className="bg-white px-4 h-8 font-bold border-neutral-200"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="neutral"
              className="bg-white px-4 h-8 font-bold border-neutral-200"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  )
}
