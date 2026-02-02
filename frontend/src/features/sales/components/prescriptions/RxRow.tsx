import type { Order } from '../../types'
import StatusBadge from '../common/StatusBadge'
import {
  renderOrderCode,
  renderCustomer,
  renderProductInfo,
  renderActions
} from '../common/OrderTableColumns'

interface SalesStaffRxRowProps {
  order: Order
  onVerify: () => void
  onReject: () => void
}

export const SalesStaffRxRow: React.FC<SalesStaffRxRowProps> = ({ order, onVerify, onReject }) => {
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
      <td className="px-6 py-5">{renderOrderCode(order, onVerify)}</td>
      <td className="px-6 py-5 text-left min-w-[180px]">{renderProductInfo(order)}</td>
      <td className="px-6 py-5 whitespace-nowrap">{renderCustomer(order)}</td>
      <td className="px-6 py-5">
        <span className="text-[12px] font-medium text-slate-600 bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-100">
          {rxSummary}
        </span>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-6 py-5">
        {renderActions(order, { onOpenDetail: onVerify, onVerify, onReject, onChat: () => {} })}
      </td>
    </tr>
  )
}
