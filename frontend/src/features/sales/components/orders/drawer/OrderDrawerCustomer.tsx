import type { OrderDetail } from '@/features/sales/types'

interface OrderDrawerCustomerProps {
  order: OrderDetail | null
}

export const OrderDrawerCustomer: React.FC<OrderDrawerCustomerProps> = ({ order }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
      Customer Information
    </h3>
    <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3 text-sm">
      <div className="flex justify-between items-center group">
        <span className="text-gray-500 font-medium">Name</span>
        <span className="font-semibold text-gray-900">{order?.customerName}</span>
      </div>
      <div className="flex justify-between items-center group">
        <span className="text-gray-500 font-medium">Phone</span>
        <span className="font-semibold text-gray-900">{order?.customerPhone}</span>
      </div>
    </div>
  </div>
)
