import { useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/utils'

interface OrderCardProps {
  id: string
  realId: string
  name: string
  date: string
  itemCount: number
  price: number
  status:
    | 'PENDING'
    | 'APPROVE'
    | 'PROCESSING'
    | 'DELIVERING'
    | 'DELIVERED'
    | 'REJECTED'
    | 'CANCELED'
  image: string
  expDate?: string
  receivedDate?: string
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
  receivedDate
}: OrderCardProps) {
  const navigate = useNavigate()
  const statusConfig = {
    PENDING: {
      label: 'Pending',
      bgColor: 'bg-[#FFF9E5]',
      textColor: 'text-[#B78103]',
      description: 'Verifying details'
    },
    APPROVE: {
      label: 'Confirmed',
      bgColor: 'bg-[#E5F6FF]',
      textColor: 'text-[#0077B6]',
      description: 'Ready for crafting'
    },
    PROCESSING: {
      label: 'Crafting',
      bgColor: 'bg-[#FFF0E5]',
      textColor: 'text-[#E65100]',
      description: 'Precision processing'
    },
    DELIVERING: {
      label: 'Shipping',
      bgColor: 'bg-[#E5FFF7]',
      textColor: 'text-[#008955]',
      description: 'On the move'
    },
    DELIVERED: {
      label: 'Delivered',
      bgColor: 'bg-[#EDF7ED]',
      textColor: 'text-[#1E4620]',
      description: 'Arrival complete'
    },
    REJECTED: {
      label: 'Rejected',
      bgColor: 'bg-[#FFF0F0]',
      textColor: 'text-[#C62828]',
      description: 'Action required'
    },
    CANCELED: {
      label: 'Cancelled',
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
        <div className="w-full lg:w-40 h-32 rounded-xl overflow-hidden bg-[#F8FAFB] flex-shrink-0 border border-mint-50/30 flex items-center justify-center p-6">
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
                    'px-3 py-1 rounded-lg text-[10px] font-bold tracking-[0.08em] uppercase',
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
            {(status === 'PROCESSING' || status === 'APPROVE') && (
              <div className="flex items-center gap-2.5 text-primary-600 bg-primary-50/20 py-1.5 px-3 rounded-lg border border-primary-100/20 inline-flex">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {status === 'PROCESSING' ? '✨ Expert Verification' : '📦 Preparing for Ship'}
                </span>
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
              onClick={() => navigate(`/account/orders/${realId}`)}
              variant="outline"
              className="flex-1 lg:flex-none h-10 rounded-xl px-6 border-mint-100 text-mint-1200 font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-mint-50 hover:border-mint-200 transition-all shadow-sm"
            >
              Details
            </Button>

            {(status === 'DELIVERING' || status === 'DELIVERED') && (
              <Button
                className={cn(
                  'flex-1 lg:flex-none h-10 rounded-xl px-6 font-bold text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm flex items-center justify-center gap-2',
                  status === 'DELIVERING'
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-white border-mint-100 text-mint-1200 hover:bg-danger-50 hover:text-danger-600 hover:border-danger-100 shadow-sm'
                )}
              >
                {status === 'DELIVERING' ? 'Track 🚚' : 'Return'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
