import { IoCheckmarkCircle } from 'react-icons/io5'

interface OrderCheckItemProps {
  orderCode: string
  orderId: string
  status: string
}

export default function OrderCheckItem({ orderCode, orderId, status }: OrderCheckItemProps) {
  const isCompleted = status === 'COMPLETED'

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        isCompleted ? 'border-mint-500 bg-mint-50' : 'border-red-300 bg-red-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isCompleted ? 'border-mint-500 bg-mint-500' : 'border-red-400 bg-red-400'
          }`}
        >
          {isCompleted ? (
            <IoCheckmarkCircle className="text-white" size={20} />
          ) : (
            <span className="text-white text-xs font-bold">✕</span>
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{orderCode}</p>
          <p className="text-xs text-gray-500">Order ID: {orderId}</p>
        </div>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-full font-semibold ${
          isCompleted ? 'bg-mint-100 text-mint-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {status}
      </span>
    </div>
  )
}
