import { Button } from '@/components/common/atoms/button'
import { BsThreeDotsVertical } from 'react-icons/bs'

// Mock data
const URGENT_ORDERS = [
  {
    id: '#ORD-7752',
    customer: {
      name: 'Alice Freeman',
      avatar: 'https://i.pravatar.cc/150?u=alice',
      email: 'alice@example.com'
    },
    product: 'Ray-Ban Aviator',
    date: 'Oct 24, 2023',
    amount: '$320.00',
    status: 'Pending',
    priority: 'High'
  },
  {
    id: '#ORD-7753',
    customer: {
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?u=bob',
      email: 'bob@example.com'
    },
    product: 'Oakley Holbrook',
    date: 'Oct 24, 2023',
    amount: '$180.50',
    status: 'Processing',
    priority: 'Urgent'
  },
  {
    id: '#ORD-7754',
    customer: {
      name: 'Charlie Brown',
      avatar: 'https://i.pravatar.cc/150?u=charlie',
      email: 'charlie@example.com'
    },
    product: 'Gucci GG0061S',
    date: 'Oct 23, 2023',
    amount: '$450.00',
    status: 'Ready',
    priority: 'Medium'
  }
]

export default function OrderTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700'
      case 'Processing':
        return 'bg-blue-100 text-blue-700'
      case 'Ready':
        return 'bg-emerald-100 text-emerald-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-sm text-gray-500">
            <th className="py-3 px-4 font-medium">ORDER ID</th>
            <th className="py-3 px-4 font-medium">CUSTOMER</th>
            <th className="py-3 px-4 font-medium">PRODUCT</th>
            <th className="py-3 px-4 font-medium">DATE</th>
            <th className="py-3 px-4 font-medium">AMOUNT</th>
            <th className="py-3 px-4 font-medium">STATUS</th>
            <th className="py-3 px-4 font-medium text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {URGENT_ORDERS.map((order) => (
            <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    {/* Placeholder if image fails */}
                    <img
                      src={order.customer.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{order.customer.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600 font-medium">{order.product}</td>
              <td className="py-3 px-4 text-gray-500">{order.date}</td>
              <td className="py-3 px-4 font-medium text-gray-900">{order.amount}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                >
                  <BsThreeDotsVertical />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
