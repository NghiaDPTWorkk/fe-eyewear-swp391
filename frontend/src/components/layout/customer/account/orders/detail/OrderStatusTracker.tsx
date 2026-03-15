import { Card } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'
import { DETAILED_ORDER_STATUS, InvoiceStatus } from '@/shared/utils/enums/invoice.enum'

interface OrderStatusTrackerProps {
  status: InvoiceStatus
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const mapBackendStatus = (
    status: InvoiceStatus
  ): { label: string; step: number; description: string } => {
    switch (status) {
      case InvoiceStatus.PENDING:
        return {
          label: DETAILED_ORDER_STATUS.PENDING,
          step: 1,
          description: 'Waiting for your payment'
        }
      case InvoiceStatus.DEPOSITED:
        return {
          label: DETAILED_ORDER_STATUS.DEPOSITED,
          step: 2,
          description: 'Payment verified, waiting for confirmation'
        }
      case InvoiceStatus.APPROVED:
        return {
          label: DETAILED_ORDER_STATUS.APPROVED,
          step: 2,
          description: 'Order confirmed by our team'
        }
      case InvoiceStatus.WAITING_ASSIGN:
        return {
          label: DETAILED_ORDER_STATUS.WAITING_ASSIGN,
          step: 3,
          description: 'Order management assignment'
        }
      case InvoiceStatus.ONBOARD:
        return {
          label: DETAILED_ORDER_STATUS.ONBOARD,
          step: 3,
          description: 'Your eyewear is being crafted'
        }
      case InvoiceStatus.COMPLETED:
        return {
          label: DETAILED_ORDER_STATUS.COMPLETED,
          step: 4,
          description: 'Processing complete, quality check passed'
        }
      case InvoiceStatus.READY_TO_SHIP:
        return {
          label: DETAILED_ORDER_STATUS.READY_TO_SHIP,
          step: 4,
          description: 'Package is ready for shipping'
        }
      case InvoiceStatus.DELIVERING:
        return {
          label: DETAILED_ORDER_STATUS.DELIVERING,
          step: 5,
          description: 'Order is on the way'
        }
      case InvoiceStatus.DELIVERED:
        return {
          label: DETAILED_ORDER_STATUS.DELIVERED,
          step: 6,
          description: 'Delivered successfully'
        }
      default:
        return {
          label: DETAILED_ORDER_STATUS.PENDING,
          step: 1,
          description: 'Order placed'
        }
    }
  }

  const statusInfo = mapBackendStatus(status)
  const steps = [
    { label: 'Payment', code: 'PENDING' },
    { label: 'Confirmed', code: 'APPROVED' },
    { label: 'Processing', code: 'ONBOARD' },
    { label: 'Inspected', code: 'COMPLETED' },
    { label: 'Shipping', code: 'DELIVERING' },
    { label: 'Delivered', code: 'DELIVERED' }
  ]

  if (
    status === InvoiceStatus.REJECTED ||
    status === InvoiceStatus.CANCELED ||
    status === InvoiceStatus.CANCEL ||
    status === InvoiceStatus.REFUNDED
  ) {
    const isRefunded = status === InvoiceStatus.REFUNDED
    return (
      <Card
        className={cn(
          'p-6 mb-8 border-2 border-dashed',
          isRefunded ? 'border-primary-100 bg-primary-50/10' : 'border-danger-100 bg-danger-50/10'
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
              isRefunded ? 'bg-primary-100 text-primary-600' : 'bg-danger-100 text-danger-600'
            )}
          >
            {isRefunded ? '💰' : '⚠️'}
          </div>
          <div>
            <p
              className={cn(
                'font-bold uppercase tracking-wider text-xs mb-1',
                isRefunded ? 'text-primary-600' : 'text-danger-600'
              )}
            >
              {DETAILED_ORDER_STATUS[status]}
            </p>
            <p className="text-sm font-medium text-gray-600">
              {isRefunded
                ? 'Your order has been refunded. Please check your bank account.'
                : 'This order has been closed. Please contact support if you have questions.'}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 mb-8 border-mint-100/50 bg-white shadow-sm overflow-x-auto scrollbar-hide">
      <div className="min-w-[700px]">
        <div className="flex justify-between relative mb-12 px-4">
          {}
          <div className="absolute top-5 left-12 right-12 h-1 bg-mint-50 -z-0">
            <div
              className="h-full bg-primary-500 transition-all duration-1000"
              style={{ width: `${((statusInfo.step - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => {
            const stepNum = index + 1
            const isActive = stepNum <= statusInfo.step
            const isCurrent = stepNum === statusInfo.step

            return (
              <div key={step.label} className="flex flex-col items-center relative z-10 w-24">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm',
                    isActive
                      ? 'bg-primary-500 border-primary-200 text-white'
                      : 'bg-white border-mint-50 text-mint-200'
                  )}
                >
                  {isActive ? '✓' : stepNum}
                </div>
                <div className="absolute top-12 flex flex-col items-center whitespace-nowrap">
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-[0.1em]',
                      isCurrent ? 'text-primary-600' : isActive ? 'text-mint-1200' : 'text-mint-200'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {}
        <div className="mt-16 text-center border-t border-mint-50 pt-6">
          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Current Status
            </span>
            <h4 className="text-xl font-bold text-mint-1200 mb-1">{statusInfo.label}</h4>
            <p className="text-sm text-primary-600 font-medium">{statusInfo.description}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
