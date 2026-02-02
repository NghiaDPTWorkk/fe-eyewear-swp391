import { Card, Button } from '@/components'
import { IoChevronForward, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface ReturnsTableProps {
  onRowClick: (id: string) => void
}

const RETURNS = [
  {
    id: 'RET-8821',
    orderId: 'ORD-2023-098',
    customer: 'Michael Scott',
    email: 'michael.s@example.com',
    reason: 'Defective Frame',
    status: 'Pending',
    statusColor: 'text-orange-600 border-orange-100',
    date: 'Oct 23, 2023'
  },
  {
    id: 'RET-8819',
    orderId: 'ORD-2023-012',
    customer: 'Pam Beesly',
    email: 'pam.b@example.com',
    reason: 'Wrong Size',
    status: 'Approved',
    statusColor: 'text-emerald-600 border-emerald-100',
    date: 'Oct 23, 2023'
  }
]

export default function ReturnsTable({ onRowClick }: ReturnsTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-neutral-100">
              <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Return ID
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Original Order
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Customer
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Reason
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Date
              </th>
              <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-right align-middle">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {RETURNS.map((ret) => (
              <tr
                key={ret.id}
                className="hover:bg-emerald-50/30 cursor-pointer group transition-all"
                onClick={() => onRowClick(ret.id)}
              >
                <td className="pl-10 px-6 py-6 text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors align-middle">
                  #{ret.id}
                </td>
                <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                  #{ret.orderId}
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="text-sm font-semibold text-[#3d4465]">{ret.customer}</div>
                  <div className="text-[11px] text-[#a4a9c1] font-medium">{ret.email}</div>
                </td>
                <td className="px-6 py-6 text-sm font-medium text-gray-500 align-middle">
                  {ret.reason}
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="flex justify-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest bg-white border shadow-sm ${ret.statusColor}`}
                    >
                      {ret.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="text-sm font-medium text-[#3d4465]">{ret.date}</div>
                </td>
                <td className="pr-10 px-6 py-6 text-right align-middle">
                  <Button
                    className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRowClick(ret.id)
                    }}
                  >
                    <IoChevronForward size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span>Showing 1 to 2 of 15 returns</span>
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
            className="min-w-[32px] px-2 font-semibold"
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
