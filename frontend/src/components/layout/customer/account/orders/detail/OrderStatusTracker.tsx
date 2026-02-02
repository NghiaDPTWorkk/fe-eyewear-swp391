import { Card } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'

interface OrderStatusTrackerProps {
  status: string
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const mapBackendStatus = (status: string): any => {
    switch (status) {
      case 'PENDING':
        return { label: 'PENDING', step: 1 }
      case 'APPROVED':
      case 'DEPOSITED':
        return { label: 'APPROVED', step: 2 }
      case 'WAITING_ASSIGN':
      case 'ONBOARD':
        return { label: 'PROCESSING', step: 3 }
      case 'DELIVERING':
        return { label: 'DELIVERING', step: 4 }
      case 'DELIVERED':
      case 'COMPLETED':
        return { label: 'DELIVERED', step: 5 }
      default:
        return { label: 'PENDING', step: 1 }
    }
  }

  const statusInfo = mapBackendStatus(status)
  const steps = ['Pending', 'Approved', 'Processing', 'Delivering', 'Delivered']

  if (status === 'REJECTED' || status === 'CANCEL') {
    return (
      <Card className="p-6 mb-8 border-danger-100 bg-danger-50/10">
        <div className="flex items-center gap-3 text-danger-600">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold uppercase tracking-wider text-xs">Order {status}</p>
            <p className="text-sm font-medium opacity-80">
              This order has been {status.toLowerCase()}. Please contact support if you have
              questions.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 mb-8 border-mint-100/50">
      <div className="flex justify-between relative mb-4">
        {/* Progress line */}
        <div className="absolute top-5 left-10 right-10 h-1 bg-mint-50 -z-0">
          <div
            className="h-full bg-primary-500 transition-all duration-1000"
            style={{ width: `${((statusInfo.step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index + 1 <= statusInfo.step
          const isCurrent = index + 1 === statusInfo.step
          return (
            <div key={step} className="flex flex-col items-center relative z-10 w-20">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500',
                  isActive
                    ? 'bg-primary-500 border-primary-100 text-white'
                    : 'bg-white border-mint-50 text-mint-200'
                )}
              >
                {isActive ? '✓' : index + 1}
              </div>
              <span
                className={cn(
                  'mt-2 text-[10px] font-bold uppercase tracking-widest',
                  isCurrent ? 'text-primary-600' : isActive ? 'text-mint-1200' : 'text-mint-200'
                )}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
