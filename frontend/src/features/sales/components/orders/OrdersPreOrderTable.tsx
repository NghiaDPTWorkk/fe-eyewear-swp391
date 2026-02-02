import { Card, Button } from '@/components'
import { IoGlassesOutline, IoChevronForward } from 'react-icons/io5'
import { StatusBadge, Pagination } from '../common'
import { TYPOGRAPHY } from '../../constants/SaleStaffDesignSystem'

// Mock data
const PRE_ORDERS = [
  {
    id: 'PO-2849',
    sku: 'RB-3025-L0205',
    name: 'Ray-Ban Aviator Gold',
    customer: 'John Doe',
    phone: '+1 (555) 012-3456',
    deposit: '$50.00',
    eta: 'Oct 12, 2023',
    status: 'delayed' as const,
    overdue: '3 days overdue'
  },
  {
    id: 'PO-2850',
    sku: 'TF-5532-B',
    name: 'Tom Ford Square Black',
    customer: 'Emily Chen',
    phone: '+1 (555) 012-3456',
    deposit: '$120.00',
    eta: 'Oct 24, 2023',
    status: 'processing' as const,
    overdue: null
  },
  {
    id: 'PO-2852',
    sku: 'PR-17WS',
    name: 'Prada Symbole',
    customer: 'Sarah Connor',
    phone: '+1 (555) 012-3456',
    deposit: '$150.00',
    eta: 'Oct 20, 2023',
    status: 'arrived' as const,
    overdue: null
  }
]

interface PreOrderTableProps {
  onRowClick: (id: string) => void
  onCreateOrder: (id: string) => void
}

export default function PreOrderTable({ onRowClick, onCreateOrder }: PreOrderTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-neutral-100">
              <th className={`pl-10 px-6 py-5 ${TYPOGRAPHY.tableHeader}`}>SKU / Product</th>
              <th className={`px-6 py-5 ${TYPOGRAPHY.tableHeader} text-center`}>Order ID</th>
              <th className={`px-6 py-5 ${TYPOGRAPHY.tableHeader}`}>Customer</th>
              <th className={`px-6 py-5 ${TYPOGRAPHY.tableHeader} text-center`}>Deposit</th>
              <th className={`px-6 py-5 ${TYPOGRAPHY.tableHeader}`}>ETA Date</th>
              <th className={`px-6 py-5 ${TYPOGRAPHY.tableHeader} text-center`}>Status</th>
              <th className={`pr-10 px-6 py-5 ${TYPOGRAPHY.tableHeader} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {PRE_ORDERS.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-emerald-50/30 transition-all cursor-pointer group"
                onClick={() => onRowClick(item.id)}
              >
                <td className="pl-10 px-6 py-6 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0">
                      <IoGlassesOutline size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{item.sku}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm text-emerald-500 font-medium text-center">
                  #{item.id}
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="text-sm font-semibold text-gray-800">{item.customer}</div>
                  <div className="text-[11px] text-gray-400 font-medium">{item.phone}</div>
                </td>
                <td className="px-6 py-6 text-sm font-semibold text-gray-800 text-center">
                  {item.deposit}
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="text-sm font-semibold text-gray-800">{item.eta}</div>
                  {item.overdue && (
                    <div className="text-[10px] text-red-400 font-medium uppercase tracking-wider">
                      {item.overdue}
                    </div>
                  )}
                </td>
                <td className="px-6 py-6 align-middle">
                  <div className="flex justify-center">
                    <StatusBadge
                      status={item.status}
                      label={item.status === 'processing' ? 'ON ORDER' : item.status.toUpperCase()}
                    />
                  </div>
                </td>
                <td className="pr-10 px-6 py-6 text-right align-middle">
                  <div className="flex gap-2 justify-end">
                    {item.status === 'arrived' && (
                      <Button
                        size="sm"
                        variant="solid"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          onCreateOrder(item.id)
                        }}
                      >
                        Create Order
                      </Button>
                    )}
                    <Button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick(item.id)
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
      <Pagination
        currentPage={1}
        totalPages={15}
        totalItems={142}
        itemsPerPage={10}
        onPageChange={() => {}}
      />
    </Card>
  )
}
