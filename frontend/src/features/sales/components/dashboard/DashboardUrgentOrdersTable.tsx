import { Card } from '@/shared/components/ui/card'
import { OrdersTable } from '../orders'
import { IoAdd, IoFilter } from 'react-icons/io5'
import { Button } from '@/components'

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
          <Button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <IoFilter /> Filter
          </Button>
          <Button className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 shadow-sm shadow-emerald-200">
            <IoAdd /> New Order
          </Button>
        </div>
      </div>
      <OrdersTable role="sales" onRowClick={onRowClick} />
    </Card>
  )
}
