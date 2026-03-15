import { IoClose } from 'react-icons/io5'
import { cn } from '@/lib/utils'
import StatusBadge from '../../common/StatusBadge'

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
            'px-2.5 py-0.5 rounded-lg text-[10px] font-medium uppercase tracking-wide',
            orderTypeLabel === 'Prescription'
              ? 'bg-mint-50 text-mint-600 border border-mint-100'
              : orderTypeLabel === 'Pre-order'
                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
          )}
        >
          {orderTypeLabel} Order
        </span>
        <StatusBadge status={status || ''} />
      </div>
      <h2 className="text-2xl font-medium text-[#0f172a] tracking-tight">Order Details</h2>
      <p className="text-slate-400 text-sm font-normal mt-1">{orderCode || 'N/A'}</p>
    </div>
    <button
      onClick={onClose}
      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all ml-4"
    >
      <IoClose size={24} />
    </button>
  </div>
)
