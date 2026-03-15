import { IoCheckmarkCircle } from 'react-icons/io5'

interface ActionStep {
  label: string
  time: string
  status: 'completed' | 'current' | 'pending'
}

interface OrderDrawerTimelineProps {
  steps: ActionStep[]
}

export const OrderDrawerTimeline: React.FC<OrderDrawerTimelineProps> = ({ steps }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
      Order Timeline
    </h3>
    <div className="relative pl-2 space-y-6">
      <div className="absolute left-[19px] top-3 bottom-1 w-[2px] bg-gray-100" />
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed'
        const isCurrent = step.status === 'current'
        return (
          <div key={index} className="relative flex gap-4 group">
            <div className="relative z-10">
              {isCompleted ? (
                <div className="w-10 h-10 rounded-full bg-emerald-400 text-white flex items-center justify-center ring-4 ring-white shadow-sm shadow-emerald-100/50">
                  <IoCheckmarkCircle size={22} className="text-white" />
                </div>
              ) : isCurrent ? (
                <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-400 text-emerald-400 flex items-center justify-center ring-4 ring-white shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center ring-4 ring-white">
                  <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
                </div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="flex flex-col">
                <h4
                  className={`font-semibold text-[13px] ${isCurrent ? 'text-emerald-500' : isCompleted ? 'text-gray-900' : 'text-gray-400'} transition-colors`}
                >
                  {step.label}
                </h4>
                {step.time && (
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">{step.time}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)
