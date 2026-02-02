import { IoClose } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface OrderDrawerHeaderProps {
  orderCode?: string
  status?: string
  orderTypeLabel: string
  onClose: () => void
}

export const OrderDrawerHeader: React.FC<OrderDrawerHeaderProps> = ({
  orderCode,
  status,
  orderTypeLabel,
  onClose
}) => (
  <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50 bg-gray-50/10">
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'px-2.5 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider',
            orderTypeLabel === 'Prescription'
              ? 'bg-blue-50 text-blue-600 border border-blue-100'
              : orderTypeLabel === 'Pre-order'
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
          )}
        >
          {orderTypeLabel} Order
        </span>
        <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
          {status}
        </span>
      </div>
      <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight">Order Details</h2>
      <p className="text-slate-400 text-sm font-medium mt-1">{orderCode}</p>
    </div>
    <button
      onClick={onClose}
      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all ml-4"
    >
      <IoClose size={24} />
    </button>
  </div>
)
