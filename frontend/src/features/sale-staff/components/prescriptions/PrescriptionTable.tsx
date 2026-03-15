import { Card, Button } from '@/components'
import {
  IoFilter,
  IoChevronForward,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoGlassesOutline
} from 'react-icons/io5'

interface PrescriptionTableProps {
  onRowClick: (id: string) => void
}

const PRESCRIPTIONS = [
  {
    sku: 'RB-3025-L0205',
    product: 'Ray-Ban Aviator Gold',
    orderId: 'ORD-2023-001',
    customer: 'John Doe',
    contact: '+1 (555) 012-3456',
    lensType: 'Progressive',
    material: 'High Index 1.67',
    date: 'Oct 24, 2023',
    status: 'GRINDING',
    statusColor: 'bg-orange-50 text-orange-600 border-orange-100'
  },
  {
    sku: 'TF-5532-B',
    product: 'Tom Ford Square Black',
    orderId: 'ORD-2023-004',
    customer: 'Alice Smith',
    contact: 'alice.s@example.com',
    lensType: 'Single Vision',
    material: 'Polycarbonate',
    date: 'Oct 23, 2023',
    status: 'COATING',
    statusColor: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    sku: 'PR-17WS',
    product: 'Prada Symbole',
    orderId: 'ORD-2023-006',
    customer: 'Michael Brown',
    contact: '+1 (555) 987-6543',
    lensType: 'Bifocal',
    material: 'Trivex',
    date: 'Oct 20, 2023',
    status: 'QA CHECK',
    statusColor: 'bg-purple-50 text-purple-600 border-purple-100'
  }
]

export default function PrescriptionTable({ onRowClick }: PrescriptionTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex gap-3">
          <Button size="sm" variant="outline" colorScheme="neutral" leftIcon={<IoFilter />}>
            Filter
          </Button>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-medium bg-white shadow-sm rounded-md text-gray-800">
              Status: All
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-800">
              Lens: Progressive
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500">Showing 1-10 of 48 orders</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                SKU / Product
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Order ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Customer
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Lens Details
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider align-middle">
                Date
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                Lab Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {PRESCRIPTIONS.map((rx) => (
              <tr
                key={rx.orderId}
                className="hover:bg-gray-50/50 cursor-pointer group"
                onClick={() => onRowClick(rx.orderId)}
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                      <IoGlassesOutline
                        size={20}
                        className="group-hover:text-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{rx.sku}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{rx.product}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-500 font-semibold align-middle tracking-tight">
                  #{rx.orderId}
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">{rx.customer}</div>
                  <div className="text-[11px] text-gray-400 font-medium">{rx.contact}</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-900">{rx.lensType}</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {rx.material}
                  </div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="text-sm font-semibold text-gray-600">{rx.date}</div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border whitespace-nowrap ${rx.statusColor}`}
                    >
                      {rx.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 h-9 w-9 text-neutral-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick(rx.orderId)
                      }}
                    >
                      <IoChevronForward size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span>Displaying 3 of 48 items</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            colorScheme="neutral"
            size="sm"
            className="px-2 border-neutral-200"
          >
            <IoChevronBackOutline />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="min-w-[32px] px-2 font-bold"
          >
            1
          </Button>
          <Button
            variant="outline"
            colorScheme="neutral"
            size="sm"
            className="px-2 border-neutral-200"
          >
            <IoChevronForwardOutline />
          </Button>
        </div>
      </div>
    </Card>
  )
}
