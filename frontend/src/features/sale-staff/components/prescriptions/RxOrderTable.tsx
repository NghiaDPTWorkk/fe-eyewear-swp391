import { IoGlassesOutline, IoEyeOutline } from 'react-icons/io5'

import { Card, Button } from '@/components'

import { TYPOGRAPHY } from '../../constants/saleStaffDesignSystem'
import Pagination from '../common/Pagination'
import StatusBadge from '../common/StatusBadge'

const RX_ORDERS = [
  {
    id: 'ORD-2023-001',
    customerName: 'John Doe',
    customerInitials: 'JD',
    date: 'Oct 24, 2023',
    frame: 'Ray-Ban 3025',
    frameColor: 'Gold / Green',
    od: { sph: '-2.25', cyl: '-0.50', axis: '180', add: '+2.00', pd: '32.0' },
    os: { sph: '-2.50', cyl: '-0.75', axis: '175', add: '+2.00', pd: '32.0' },
    lensType: 'Progressive',
    status: 'pending' as const,
    urgent: true
  },
  {
    id: 'ORD-2023-004',
    customerName: 'Alice Smith',
    customerInitials: 'AS',
    date: 'Oct 23, 2023',
    frame: 'Oakley 8050',
    frameColor: 'Matte Black',
    od: { sph: '+1.00', cyl: '0.00', axis: '0', add: '-', pd: '30.5' },
    os: { sph: '+1.25', cyl: '-0.25', axis: '90', add: '-', pd: '30.5' },
    lensType: 'Single Vision',
    status: 'pending' as const,
    urgent: false
  }
]

interface RxOrderTableProps {
  onSelectOrder: (id: string) => void
}

export default function RxOrderTable({ onSelectOrder }: RxOrderTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} w-64`}>Patient & Order</th>
              <th className={`px-4 py-4 ${TYPOGRAPHY.tableHeader} w-40`}>Frame</th>
              <th
                className={`px-2 py-4 ${TYPOGRAPHY.tableHeader} text-center bg-emerald-50/30 border-l border-emerald-100/50`}
                colSpan={5}
              >
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 mb-1">
                  <IoEyeOutline /> Right Eye (OD)
                </div>
              </th>
              <th
                className={`px-2 py-4 ${TYPOGRAPHY.tableHeader} text-center border-l border-gray-100`}
                colSpan={5}
              >
                <div className="flex items-center justify-center gap-1.5 text-gray-600 mb-1">
                  <IoEyeOutline className="text-gray-400" /> Left Eye (OS)
                </div>
              </th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} text-center`}>Status</th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {RX_ORDERS.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-emerald-50/10 transition-colors group cursor-pointer"
                onClick={() => onSelectOrder(order.id)}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold border border-emerald-200 shadow-sm">
                      {order.customerInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {order.customerName}
                        </span>
                        {order.urgent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-50 text-red-600 border border-red-100">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                        <span className="text-emerald-500 font-semibold">#{order.id}</span>
                        <span className="mx-1">•</span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                      <IoGlassesOutline className="text-gray-400 text-lg" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700">{order.frame}</div>
                      <div className="text-[10px] text-gray-400">{order.frameColor}</div>
                    </div>
                  </div>
                </td>
                {}
                {['sph', 'cyl', 'axis', 'add', 'pd'].map((key) => (
                  <td
                    key={`od-${key}`}
                    className="px-1 py-4 text-sm text-center font-medium text-emerald-900 bg-emerald-50/10"
                  >
                    {order.od[key as keyof typeof order.od]}
                  </td>
                ))}
                {}
                {['sph', 'cyl', 'axis', 'add', 'pd'].map((key) => (
                  <td
                    key={`os-${key}`}
                    className="px-1 py-4 text-sm text-center font-normal text-gray-500"
                  >
                    {order.os[key as keyof typeof order.os]}
                  </td>
                ))}
                <td className="px-6 py-4 text-center align-middle">
                  <StatusBadge status={order.status} label="Pending" />
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <Button
                    variant="solid"
                    size="sm"
                    className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectOrder(order.id)
                    }}
                  >
                    Verify
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={1}
        totalPages={5}
        totalItems={48}
        itemsPerPage={10}
        onPageChange={() => {}}
      />
    </Card>
  )
}
