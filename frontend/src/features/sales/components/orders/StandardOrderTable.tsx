/**
 * StandardOrderTable Component
 * Table for displaying standard orders that auto-forward to Packaging.
 * No manual confirmation needed - shows "Ready for Packaging" status.
 */
import { Card, Button } from '@/components'
import { IoChevronForward, IoGlassesOutline } from 'react-icons/io5'
import Pagination from '../common/CommonPagination'
import OrderStatusIndicator from '../common/CommonOrderStatusIndicator'
import { TYPOGRAPHY } from '../../constants/saleStaffDesignSystem'

// Mock data for standard orders
const STANDARD_ORDERS = [
  {
    id: 'ORD-2023-101',
    customerName: 'Michael Brown',
    customerInitials: 'MB',
    date: 'Oct 28, 2023',
    product: 'Ray-Ban Clubmaster',
    total: '$245.00',
    status: 'ready' as const
  },
  {
    id: 'ORD-2023-102',
    customerName: 'Sarah Wilson',
    customerInitials: 'SW',
    date: 'Oct 28, 2023',
    product: 'Oakley Holbrook',
    total: '$189.00',
    status: 'ready' as const
  },
  {
    id: 'ORD-2023-103',
    customerName: 'David Lee',
    customerInitials: 'DL',
    date: 'Oct 27, 2023',
    product: 'Gucci GG0061S',
    total: '$420.00',
    status: 'sent' as const
  }
]

interface StandardOrderTableProps {
  onRowClick: (id: string) => void
}

export default function StandardOrderTable({ onRowClick }: StandardOrderTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader}`}>Order ID</th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader}`}>Customer</th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader}`}>Product</th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} text-center`}>Total</th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} text-center`}>
                Packaging Status
              </th>
              <th className={`px-6 py-4 ${TYPOGRAPHY.tableHeader} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {STANDARD_ORDERS.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-emerald-50/20 transition-colors cursor-pointer group"
                onClick={() => onRowClick(order.id)}
              >
                <td className="px-6 py-4 align-middle">
                  <span className="text-sm font-semibold text-emerald-600">#{order.id}</span>
                  <div className="text-[10px] text-gray-400 mt-0.5">{order.date}</div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold">
                      {order.customerInitials}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{order.customerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-2">
                    <IoGlassesOutline className="text-gray-400" />
                    <span className="text-sm text-gray-700">{order.product}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <span className="text-sm font-semibold text-gray-900">{order.total}</span>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  {/* Auto-forward status indicator - NO confirm button needed */}
                  <OrderStatusIndicator status={order.status} />
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-emerald-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRowClick(order.id)
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
      <Pagination
        currentPage={1}
        totalPages={13}
        totalItems={128}
        itemsPerPage={10}
        onPageChange={() => {}}
      />
    </Card>
  )
}
