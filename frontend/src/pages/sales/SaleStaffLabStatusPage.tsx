import { Container, Card, Button } from '@/components'
import {
  IoFilter,
  IoRefresh,
  IoFlaskOutline,
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoChevronForward
} from 'react-icons/io5'

import { PageHeader } from '@/features/sales/components/common'

export default function SaleStaffLabStatusPage() {
  const labOrders = [
    // ... existing labOrders data
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
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Lab Status Tracking"
          subtitle="Monitor production stages, urgent requests, and lens specifications."
          breadcrumbs={[
            { label: 'Dashboard', path: '/salestaff/dashboard' },
            { label: 'Lab Status' }
          ]}
          noMargin
        />
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
            className="rounded-xl font-semibold px-4"
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
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">
                In Production
              </p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">42</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <IoFlaskOutline size={20} />
            </div>
          </Card>
          <Card className="p-4 border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">
                Urgent / Late
              </p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">8</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
              <IoWarningOutline size={20} />
            </div>
          </Card>
          <Card className="p-4 border border-neutral-100 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider">
                Ready for QC
              </p>
              <h3 className="text-2xl font-semibold text-neutral-900 mt-1">12</h3>
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
              <h3 className="text-lg font-semibold text-gray-900">
                Lens Specifications{' '}
                <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] rounded uppercase tracking-wider">
                  Selected: #ORD-7352
                </span>
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-neutral-400 tracking-wider italic">
              Read-Only View
            </span>
          </div>

          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-2 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 tracking-wider mb-2">
                  Lens Type
                </p>
                <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
                  Progressive Digital Freeform
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 tracking-wider mb-2">
                  Material
                </p>
                <div className="px-3 py-2 bg-neutral-50 rounded-lg text-sm font-medium text-neutral-800">
                  High Index 1.67
                </div>
              </div>
            </div>

            <div className="col-span-1 border-x border-neutral-100 px-6 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 tracking-wider mb-2 text-center">
                  Sphere (SPH)
                </p>
                <div className="flex gap-2 justify-center">
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider">
                      OD
                    </span>
                    <div className="text-sm font-semibold text-neutral-900">-2.50</div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider">
                      OS
                    </span>
                    <div className="text-sm font-semibold text-neutral-900">-2.75</div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 tracking-wider mb-2 text-center">
                  Cylinder (CYL)
                </p>
                <div className="flex gap-2 justify-center">
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider">
                      OD
                    </span>
                    <div className="text-sm font-semibold text-neutral-900">-0.50</div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 font-semibold tracking-wider">
                      OS
                    </span>
                    <div className="text-sm font-semibold text-neutral-900">-0.75</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Lab Notes
                </p>
                <div className="p-3 bg-amber-50 rounded-lg text-[11px] font-medium text-amber-800 leading-relaxed border border-amber-100">
                  Customer requested rush delivery if possible. Careful with frame alignment, known
                  sensitive fit.
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Coating
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded tracking-wider">
                    Anti-Reflective
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded tracking-wider">
                    Blue Light Filter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

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
              {labOrders.map((order, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-emerald-50/30 transition-all cursor-pointer group"
                  onClick={() => console.warn('Selecting order:', order.id)}
                >
                  <td className="pl-10 px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-emerald-500 group-hover:text-emerald-600 transition-colors">
                      {order.id}
                    </div>
                    <div className="text-[11px] text-[#a4a9c1] font-medium">
                      Progressive Digital
                    </div>
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
                      className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[9px] font-semibold tracking-widest border shadow-sm bg-white ${order.stationColor.replace('bg-', 'text-').replace('text-', 'border-')}`}
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
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-semibold tracking-widest shadow-sm bg-white ${order.urgencyColor.replace('bg-', 'text-').replace('text-', 'border-')}`}
                      >
                        {order.urgency}
                      </span>
                    </div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right">
                    <button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.warn('Action clicked for:', order.id)
                      }}
                    >
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
    </Container>
  )
}
