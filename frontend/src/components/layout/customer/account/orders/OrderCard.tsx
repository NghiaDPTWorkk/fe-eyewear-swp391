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
      label: 'PENDING',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'Waiting for verification'
    },
    APPROVE: {
      label: 'APPROVED',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Order confirmed'
    },
    PROCESSING: {
      label: 'PROCESSING',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Crafting your eyewear'
    },
    DELIVERING: {
      label: 'DELIVERING',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
      description: 'On its way to you'
    },
    DELIVERED: {
      label: 'DELIVERED',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Successfully delivered'
    },
    REJECTED: {
      label: 'REJECTED',
      bgColor: 'bg-danger-50',
      textColor: 'text-danger-600',
      description: 'Order not accepted'
    },
    CANCELED: {
      label: 'CANCELED',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-500',
      description: 'Order cancelled'
    }
  }

  const config = statusConfig[status]

  return (
    <Card className="p-6 mb-4 hover:shadow-md transition-all border-mint-100/50">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-mint-50">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase',
                    config.bgColor,
                    config.textColor
                  )}
                >
                  {config.label}
                </span>
                <span className="text-[11px] font-semibold text-gray-400">
                  {status === 'DELIVERING' && expDate
                    ? `Exp. ${expDate}`
                    : status === 'DELIVERED' && receivedDate
                      ? `Received ${receivedDate}`
                      : config.description}
                </span>
              </div>
              <PriceTag price={price} className="text-xl font-bold text-mint-1200" />
            </div>

            <h3 className="text-lg font-bold text-mint-1200 mb-1">
              {name} #{id}
            </h3>
            <p className="text-sm font-medium text-gray-500">
              Placed on {date} • {itemCount} {itemCount > 1 ? 'Items' : 'Item'}
            </p>
          </div>

          {/* Progress or Message */}
          <div className="mt-4">
            {status === 'DELIVERING' && (
              <div className="w-full">
                <div className="h-1.5 w-full bg-mint-50 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary-500 rounded-full w-[60%]" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Shipped</span>
                  <span>Destination</span>
                </div>
              </div>
            )}
            {status === 'PROCESSING' && (
              <div className="flex items-center gap-2 text-primary-600">
                <span className="text-[12px] font-bold">
                  ✨ Our optical experts are verifying your prescription
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-end gap-2 ml-4">
          {status === 'DELIVERING' && (
            <Button className="rounded-xl px-6 py-5 bg-primary-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary-600 transition-all flex items-center gap-2">
              Track Order <span>🚚</span>
            </Button>
          )}
          {status === 'DELIVERED' && (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/account/orders/${realId}`)}
                variant="outline"
                className="rounded-xl px-6 border-mint-200 text-mint-1200 font-bold text-xs"
              >
                Details
              </Button>
              <Button
                variant="outline"
                className="rounded-xl px-6 border-mint-200 text-mint-1200 font-bold text-xs"
              >
                Return
              </Button>
            </div>
          )}
          {(status === 'PENDING' ||
            status === 'APPROVE' ||
            status === 'PROCESSING' ||
            status === 'DELIVERING') && (
            <Button
              onClick={() => navigate(`/account/orders/${realId}`)}
              variant="outline"
              className="rounded-xl px-6 border-mint-200 text-mint-1200 font-bold text-xs"
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
