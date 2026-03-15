import { IoArrowBackOutline, IoRadioButtonOn, IoRadioButtonOff } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

interface OrderDrawerUpdateStatusProps {
  onBack: () => void
  selectedStatus: string | null
  setSelectedStatus: (status: string) => void
  onConfirm: () => void
}

export const OrderDrawerUpdateStatus: React.FC<OrderDrawerUpdateStatusProps> = ({
  onBack,
  selectedStatus,
  setSelectedStatus,
  onConfirm
}) => {
  const statusOptions = [
    { label: 'In Production', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' },
    { label: 'Quality Check', color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]' },
    { label: 'Ready to Ship', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' },
    { label: 'Shipped', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' },
    { label: 'Delivered', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' },
    { label: 'On Hold', color: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]' }
  ]

  return (
    <div className="absolute inset-0 flex flex-col bg-white z-20">
      <div className="p-6 pb-4 border-b border-neutral-50 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer group"
        >
          <IoArrowBackOutline
            size={22}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Update Status</h2>
          <p className="text-gray-500 text-xs mt-0.5">Select the next phase</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-3">
        {statusOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => setSelectedStatus(option.label)}
            className={cn(
              'w-full p-4 rounded-xl border flex items-center justify-between transition-all group',
              selectedStatus === option.label
                ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5 shadow-sm'
                : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50 shadow-none'
            )}
          >
            <span
              className={cn(
                'text-sm font-semibold',
                selectedStatus === option.label ? 'text-emerald-900' : 'text-gray-700'
              )}
            >
              {option.label}
            </span>
            {selectedStatus === option.label ? (
              <IoRadioButtonOn className="text-emerald-500" size={20} />
            ) : (
              <IoRadioButtonOff className="text-gray-300" size={20} />
            )}
          </button>
        ))}
      </div>
      <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
        <Button
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
          size="lg"
          onClick={onConfirm}
        >
          Confirm Update
        </Button>
      </div>
    </div>
  )
}
