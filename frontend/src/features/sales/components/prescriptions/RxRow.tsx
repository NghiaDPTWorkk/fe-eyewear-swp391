import { memo } from 'react'
import type { Order } from '../../types'
import StatusBadge from '../common/StatusBadge'
import {
  renderOrderCode,
  renderProductInfo,
  renderVerificationStatus,
  renderActions
} from '../common/OrderTableColumns'

interface SalesStaffRxRowProps {
  order: Order
  onVerify: () => void
  onReject?: (order: Order) => void
}

export const SalesStaffRxRow: React.FC<SalesStaffRxRowProps> = memo(
  ({ order, onVerify, onReject }) => {
    const lensProduct = order.products?.find((p) => p.lens)
    const rx = lensProduct?.lens?.parameters
    const rxSummary = rx
      ? `R: ${rx.right?.SPH}/${rx.right?.CYL} L: ${rx.left?.SPH}/${rx.left?.CYL}`
      : '-'

    return (
      <tr
        className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group text-center cursor-pointer"
        onClick={onVerify}
      >
        <td className="px-6 py-5 whitespace-nowrap">{renderOrderCode(order, onVerify)}</td>
        <td className="px-6 py-5 text-left min-w-[200px]">{renderProductInfo(order)}</td>
        <td className="px-6 py-5 whitespace-nowrap">
          <span className="text-xs font-medium text-slate-600 bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-100 whitespace-nowrap inline-block">
            {rxSummary}
          </span>
        </td>
        <td className="px-6 py-5 whitespace-nowrap">{renderVerificationStatus(order)}</td>
        <td className="px-6 py-5 whitespace-nowrap">
          <div className="flex justify-center">
            <StatusBadge status={order.status} />
          </div>
        </td>
        <td className="px-6 py-5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          {renderActions(order, {
            onOpenDetail: onVerify,
            onVerify,
            onChat: () => {},
            onReject: () => onReject && onReject(order)
          })}
        </td>
      </tr>
    )
  }
)
