import { IoEyeOutline, IoChevronForward, IoTimeOutline } from 'react-icons/io5'
import { Button } from '@/ui'
import type { Column, Order } from './types'

export const defaultColumns: Column<Order>[] = [
  {
    header: 'Order ID',
    render: (order) => (
      <div>
        <div>{order.id}</div>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mt-1">
          <div className="bg-emerald-400 h-full rounded-full w-1/2"></div>
        </div>
      </div>
    ),
    className: 'font-medium'
  },
  {
    header: 'Customer',
    render: (order) => order.customer
  },
  {
    header: 'Items',
    render: (order) => order.item,
    className: 'text-gray-400'
  },
  {
    header: 'Waiting For',
    render: (order) => order.waitingFor || '-',
    className: 'text-purple-600 font-medium'
  },
  {
    header: 'Current Status',
    render: (order) => (
      <span className={`px-3 py-1 rounded-md text-xs font-medium ${order.statusColor}`}>
        {order.currentStatus}
      </span>
    )
  },
  {
    header: 'Time Elapsed',
    render: (order) => (
      <div className="flex items-center gap-1.5">
        <IoTimeOutline />
        {order.timeElapsed}
      </div>
    ),
    className: 'text-gray-500'
  },
  {
    header: 'Actions',
    headerClassName: 'text-center',
    render: (order) => (
      <div className="flex items-center justify-center gap-4">
        <Button className="text-blue-500 hover:text-blue-700">
          <IoEyeOutline size={20} />
        </Button>
        <button
          className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-white text-xs font-medium transition-colors ${
            order.isNextActive
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={!order.isNextActive}
        >
          Next <IoChevronForward />
        </button>
      </div>
    )
  }
]
