import {
  IoCheckmarkCircleOutline,
  IoEyeOutline,
  IoChatbubbleEllipsesOutline
} from 'react-icons/io5'
import type { Order } from '../../types'

interface ActionButtonsProps {
  order: Order
  onVerify: () => void
  onReject: () => void
  onViewDetail: () => void
}

import { OrderType } from '@/shared/utils/enums/order.enum'

export const ActionButtons: React.FC<ActionButtonsProps> = ({ order, onVerify, onViewDetail }) => {
  const isMfg = order.type?.includes(OrderType.MANUFACTURING) || order.isPrescription
  const canVerify = isMfg && order.status !== 'VERIFIED' && order.status !== 'APPROVED'

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
        onClick={(e) => {
          e.stopPropagation()
          alert('Chat Modal Placeholder')
        }}
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
          className="text-mint-500 hover:text-mint-600 transition-colors"
          title="Verify Prescription"
        >
          <IoCheckmarkCircleOutline size={19} />
        </button>
      )}
    </div>
  )
}
