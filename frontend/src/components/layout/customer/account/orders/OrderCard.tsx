import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/utils'
import { CUSTOMER_STATUS, InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { paymentService } from '@/features/customer/services/payment.service'
import { PaymentMethodType } from '@/shared/utils/enums/payment.enum'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface OrderCardProps {
  id: string
  realId: string
  name: string
  date: string
  itemCount: number
  price: number
  status: InvoiceStatus
  image: string
  expDate?: string
  receivedDate?: string
  canCancel?: boolean
  isCancelling?: boolean
  onCancel?: (invoiceId: string) => void
  paymentId?: string
  paymentMethod?: PaymentMethodType
  paymentUrl?: string | null
}

export function OrderCard({
  id,
  realId,
  name,
  date,
  itemCount,
  price,
  status,
  image,
  expDate,
  receivedDate,
  canCancel = false,
  isCancelling = false,
  onCancel,
  paymentId,
  paymentMethod,
  paymentUrl
}: OrderCardProps) {
  const navigate = useNavigate()
  const [isPaying, setIsPaying] = useState(false)

  const handlePayNow = async () => {
    if (paymentUrl) {
      window.location.href = paymentUrl
      return
    }

    if (!realId || !paymentId || !paymentMethod) {
      toast.error('Payment information is missing')
      return
    }

    try {
      setIsPaying(true)
      let response
      if (paymentMethod === PaymentMethodType.VNPAY) {
        response = await paymentService.getVNPayUrl(realId, paymentId)
      } else if (paymentMethod === PaymentMethodType.PAYOS) {
        response = await paymentService.getPayOSUrl(realId, paymentId)
      }

      if (response?.success && response.data.url) {
        window.location.href = response.data.url
      } else {
        toast.error('Failed to create payment link')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred while creating payment link')
    } finally {
      setIsPaying(false)
    }
  }

  const statusConfig: Record<
    InvoiceStatus,
    { label: string; bgColor: string; textColor: string; description: string }
  > = {
    [InvoiceStatus.PENDING]: {
      label: CUSTOMER_STATUS.PENDING,
      bgColor: 'bg-[#FFF9E5]',
      textColor: 'text-[#B78103]',
      description: 'Verifying details'
    },
    [InvoiceStatus.DEPOSITED]: {
      label: CUSTOMER_STATUS.DEPOSITED,
      bgColor: 'bg-[#E5F6FF]',
      textColor: 'text-[#0077B6]',
      description: 'Order confirmed'
    },
    [InvoiceStatus.APPROVED]: {
      label: CUSTOMER_STATUS.APPROVED,
      bgColor: 'bg-[#E5F6FF]',
      textColor: 'text-[#0077B6]',
      description: 'Ready for crafting'
    },
    [InvoiceStatus.ONBOARD]: {
      label: CUSTOMER_STATUS.ONBOARD,
      bgColor: 'bg-[#FFF0E5]',
      textColor: 'text-[#E65100]',
      description: 'Precision processing'
    },
    [InvoiceStatus.COMPLETED]: {
      label: CUSTOMER_STATUS.COMPLETED,
      bgColor: 'bg-[#EDF7ED]',
      textColor: 'text-[#1E4620]',
      description: 'Ready to ship'
    },
    [InvoiceStatus.READY_TO_SHIP]: {
      label: CUSTOMER_STATUS.READY_TO_SHIP,
      bgColor: 'bg-[#EDF7ED]',
      textColor: 'text-[#1E4620]',
      description: 'Waiting for pickup'
    },
    [InvoiceStatus.DELIVERING]: {
      label: CUSTOMER_STATUS.DELIVERING,
      bgColor: 'bg-[#E5FFF7]',
      textColor: 'text-[#008955]',
      description: 'On the move'
    },
    [InvoiceStatus.DELIVERED]: {
      label: CUSTOMER_STATUS.DELIVERED,
      bgColor: 'bg-[#EDF7ED]',
      textColor: 'text-[#1E4620]',
      description: 'Arrival complete'
    },
    [InvoiceStatus.REFUNDED]: {
      label: CUSTOMER_STATUS.REFUNDED,
      bgColor: 'bg-[#F5F5F5]',
      textColor: 'text-[#616161]',
      description: 'Order refunded'
    },
    [InvoiceStatus.REJECTED]: {
      label: CUSTOMER_STATUS.REJECTED,
      bgColor: 'bg-[#FFF0F0]',
      textColor: 'text-[#C62828]',
      description: 'Action required'
    },
    [InvoiceStatus.CANCELED]: {
      label: CUSTOMER_STATUS.CANCELED,
      bgColor: 'bg-[#F5F5F5]',
      textColor: 'text-[#616161]',
      description: 'Order voided'
    },
    [InvoiceStatus.WAITING_ASSIGN]: {
      label: CUSTOMER_STATUS.WAITING_ASSIGN,
      bgColor: 'bg-[#FFF0E5]',
      textColor: 'text-[#E65100]',
      description: 'Assigning expert'
    },
    [InvoiceStatus.CANCEL]: {
      label: CUSTOMER_STATUS.CANCEL,
      bgColor: 'bg-[#F5F5F5]',
      textColor: 'text-[#616161]',
      description: 'Order voided'
    }
  }

  const config = statusConfig[status]

  return (
    <Card className="p-6 mb-6 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 border-mint-100/40 group bg-white rounded-[20px]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image - Precise Aspect Ratio */}
        <div
          onClick={() => navigate(PATHS.ACCOUNT.ORDER_DETAIL(realId))}
          className="cursor-pointer w-full lg:w-40 h-32 rounded-xl overflow-hidden bg-[#F8FAFB] flex-shrink-0 border border-mint-50/30 flex items-center justify-center p-6"
        >
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Info Area - Balanced Spacing */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'px-3 py-1 rounded-lg text-[10px] font-bold tracking-[0.08em] uppercase cursor-pointer',
                    config.bgColor,
                    config.textColor
                  )}
                >
                  {config.label}
                </span>
                <span className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                  {status === 'DELIVERING' && expDate
                    ? `Exp. ${expDate}`
                    : status === 'DELIVERED' && receivedDate
                      ? `Received ${receivedDate}`
                      : config.description}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-mint-1200 mb-2 leading-snug group-hover:text-primary-600 transition-colors">
              {name}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-1.5 uppercase tracking-wide">
                <span className="text-[10px] font-medium text-gray-300">Order</span>
                <span className="text-gray-500">#{id}</span>
              </div>
              <div className="w-1 h-1 bg-gray-200 rounded-full hidden sm:block" />
              <div className="flex items-center gap-1.5 uppercase tracking-wide">
                <span className="text-[10px] font-medium text-gray-300">Placed</span>
                <span className="text-gray-500">{date}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center mt-4 gap-x-4 gap-y-2 text-xs font-semibold text-gray-400">
              <div className="w-1 h-1 bg-gray-200 rounded-full hidden sm:block" />
              <span className="uppercase tracking-wide">
                {itemCount} {itemCount > 1 ? 'Items' : 'Item'}
              </span>
            </div>
          </div>

          {/* Clean Progress/Status Messages */}
          <div className="mt-6">
            {status === 'DELIVERING' && (
              <div className="w-full max-w-xs">
                <div className="h-1 w-full bg-mint-50/50 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-primary-500 rounded-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="text-primary-600">Transit</span>
                  <span>Arrival</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar - Clean Transitions */}
        <div className="flex lg:flex-col justify-end lg:justify-between gap-3 lg:min-w-[180px] border-t lg:border-t-0 lg:border-l border-mint-50/50 pt-6 lg:pt-2 lg:pl-8">
          <div className="mb-2 text-right lg:text-left">
            <PriceTag
              price={price}
              className="text-[26px] font-bold text-mint-1200 tracking-tight"
            />
          </div>

          <div className="flex lg:flex-col gap-3 flex-1 lg:flex-none">
            <Button
              onClick={() => navigate(PATHS.ACCOUNT.ORDER_DETAIL(realId))}
              variant="outline"
              className="flex-1 lg:flex-none h-10 rounded-xl px-6 border-mint-100 text-mint-1200 font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-mint-50 hover:border-mint-200 transition-all shadow-sm"
            >
              Details
            </Button>

            {canCancel && onCancel && (
              <Button
                onClick={() => onCancel(realId)}
                disabled={isCancelling}
                className="flex-1 lg:flex-none h-10 rounded-xl px-6 font-bold text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm bg-white border border-danger-100 text-danger-600 hover:bg-danger-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </Button>
            )}

            {status === InvoiceStatus.PENDING && paymentUrl && (
              <Button
                onClick={handlePayNow}
                isLoading={isPaying}
                disabled={isPaying}
                className="flex-1 lg:flex-none h-10 rounded-xl px-6 font-bold text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm bg-primary-500 text-white hover:bg-primary-600"
              >
                Pay Now
              </Button>
            )}

            {(status === InvoiceStatus.DELIVERED || status === InvoiceStatus.COMPLETED) && (
              <Button
                className={cn(
                  'flex-1 lg:flex-none h-10 rounded-xl px-6 font-bold text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm flex items-center justify-center gap-2',
                  status === InvoiceStatus.DELIVERED
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-white border-mint-100 text-mint-1200 hover:bg-danger-50 hover:text-danger-600 hover:border-danger-100 shadow-sm'
                )}
                onClick={() => navigate(PATHS.ACCOUNT.ORDER_RETURN(realId))}
              >
                Return
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
