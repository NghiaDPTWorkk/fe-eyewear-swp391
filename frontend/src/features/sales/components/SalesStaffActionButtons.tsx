import {
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoChatbubbleEllipsesOutline
} from 'react-icons/io5'
import type { Order } from '../types'

interface SalesStaffActionButtonsProps {
  order: Order
  onVerify: () => void
  onReject: () => void
  onViewDetail: () => void
}

export const SalesStaffActionButtons: React.FC<SalesStaffActionButtonsProps> = ({
  order,
  onVerify,
  onViewDetail
}) => {
  const canVerify = order.isPrescription && order.status === 'WAITING_ASSIGN'

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onViewDetail()
        }}
        className="text-slate-400 hover:text-slate-600 transition-colors"
        title="View Details"
      >
        <IoEyeOutline size={19} />
      </button>

      <button
        className="text-blue-400 hover:text-blue-600 transition-colors"
        title="Contact Customer"
      >
        <IoChatbubbleEllipsesOutline size={18} />
      </button>

      {canVerify && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onVerify()
          }}
          className="text-primary-500 hover:text-primary-600 transition-colors"
          title="Verify Prescription"
        >
          <IoCheckmarkCircleOutline size={19} />
        </button>
      )}
    </div>
  )
}
