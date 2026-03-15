import {
  IoArrowBackOutline,
  IoAlertCircleOutline,
  IoRadioButtonOn,
  IoRadioButtonOff
} from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'

interface StatusOption {
  label: string
  color: string
}

interface DrawerStatusUpdateViewProps {
  orderId: string
  currentStatus: string
  selectedStatus: string | null
  setSelectedStatus: (status: string) => void
  onConfirm: () => void
  onBack: () => void
}

const statusOptions: StatusOption[] = [
  { label: 'In Production', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' },
  { label: 'Quality Check', color: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]' },
  { label: 'Ready to Ship', color: 'bg-[#dbeafe] text-[#1d4ed8] border-[#bfdbfe]' },
  { label: 'Shipped', color: 'bg-[#f3e8ff] text-[#7e22ce] border-[#e9d5ff]' },
  { label: 'Delivered', color: 'bg-[#f3f4f6] text-[#374151] border-[#e5e7eb]' },
  { label: 'On Hold', color: 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]' }
]

export function DrawerStatusUpdateView({
  orderId,
  currentStatus,
  selectedStatus,
  setSelectedStatus,
  onConfirm,
  onBack
}: DrawerStatusUpdateViewProps) {
  return (
    <div className="flex flex-col h-full">
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
          <p className="text-gray-500 text-xs mt-0.5">Select the next phase for {orderId}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3 items-start">
          <IoAlertCircleOutline className="text-blue-500 mt-0.5" size={18} />
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Changing order status will notify the customer and trigger downstream laboratory
            workflows.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-2 mb-3">
            AVAILABLE STATUSES
          </h3>
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.label
            const isCurrentStatus = currentStatus === option.label
            return (
              <button
                key={option.label}
                onClick={() => setSelectedStatus(option.label)}
                className={cn(
                  'w-full p-4 rounded-xl border flex items-center justify-between transition-all group',
                  isSelected
                    ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-2.5 h-2.5 rounded-full', option.color.split(' ')[0])} />
                  <span
                    className={cn(
                      'text-sm font-semibold',
                      isSelected ? 'text-emerald-900' : 'text-gray-700'
                    )}
                  >
                    {option.label}
                    {isCurrentStatus && (
                      <span className="ml-2 text-[10px] font-semibold text-[#15803d] bg-[#dcfce7] px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                        Current
                      </span>
                    )}
                  </span>
                </div>
                {isSelected ? (
                  <IoRadioButtonOn className="text-emerald-500" size={20} />
                ) : (
                  <IoRadioButtonOff
                    className="text-gray-300 group-hover:text-emerald-300"
                    size={20}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-6 pt-4 border-t border-gray-50 flex gap-4 bg-neutral-50/50">
        <Button
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg h-12 font-semibold rounded-2xl border-none"
          size="lg"
          onClick={onConfirm}
          disabled={selectedStatus === currentStatus}
        >
          Confirm Update
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-gray-200 bg-white hover:bg-gray-50 text-gray-600 h-12 font-semibold rounded-2xl"
          size="lg"
          onClick={onBack}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
