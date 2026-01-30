/**
 * UrgentOrdersTable Component
 * Displays urgent orders requiring immediate attention
 */
import { Card } from '@/shared/components/ui/card'
import { OrderTable } from '@/features/sales/components/orders'
import { IoFilter, IoAdd } from 'react-icons/io5'

interface UrgentOrdersTableProps {
  onRowClick: (id: string) => void
}

export default function UrgentOrdersTable({ onRowClick }: UrgentOrdersTableProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Urgent Orders</h3>
          <p className="text-sm text-gray-500">Orders requiring immediate attention.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <IoFilter /> Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 shadow-sm shadow-emerald-200">
            <IoAdd /> New Order
          </button>
        </div>
      </div>
      <OrderTable role="sales" onRowClick={onRowClick} />
    </Card>
  )
}
