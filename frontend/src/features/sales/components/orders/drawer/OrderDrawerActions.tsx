import { Button } from '@/components'
import { cn } from '@/lib/utils'

interface OrderDrawerActionsProps {
  isPrescription: boolean
  isApproved: boolean
  onUpdateStatus: () => void
  onViewFull: () => void
}

export const OrderDrawerActions: React.FC<OrderDrawerActionsProps> = ({
  isPrescription,
  isApproved,
  onUpdateStatus,
  onViewFull
}) => (
  <div className="p-6 pt-4 border-t border-gray-50 flex flex-col gap-3 bg-white">
    <Button
      className={cn(
        'w-full h-14 font-medium rounded-2xl transition-all active:scale-[0.98] border-none text-sm group shadow-lg',
        isPrescription && !isApproved
          ? 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
          : 'bg-mint-600 hover:bg-mint-700 text-white shadow-mint-100'
      )}
      size="lg"
      onClick={onViewFull}
    >
      {isPrescription ? (isApproved ? 'View Verify Detail' : 'Verify') : 'View Detail'}
    </Button>
    <Button
      variant="outline"
      className="w-full h-12 font-semibold rounded-2xl bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
      onClick={onUpdateStatus}
    >
      Update Status
    </Button>
  </div>
)
