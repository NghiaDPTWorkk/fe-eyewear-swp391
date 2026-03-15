import { IoArrowBackOutline, IoClose, IoCheckmark } from 'react-icons/io5'
import { Button } from '@/components'
import { cn } from '@/lib/utils'
import type { OrderDetail } from '@/features/sales/types'

interface OrderDrawerRxVerifyProps {
  order: OrderDetail | null
  onBack: () => void
  onApprove: () => void
  onReject: () => void
  processing: boolean
}

export const OrderDrawerRxVerify: React.FC<OrderDrawerRxVerifyProps> = ({
  order,
  onBack,
  onApprove,
  onReject,
  processing
}) => {
  const rxProduct = order?.products.find((p) => p.lens)
  const lens = rxProduct?.lens
  if (!order || !lens)
    return <div className="p-4 text-center text-gray-500">No prescription data available.</div>

  const params = lens.parameters as any
  const left = params.left || { SPH: 0, CYL: 0, AXIS: 0 }
  const right = params.right || { SPH: 0, CYL: 0, AXIS: 0 }
  const PD = params.PD || params.pd || 0
  const isVerified = ['VERIFIED', 'APPROVED'].includes(order.status)

  return (
    <div className="absolute inset-0 flex flex-col bg-white z-20">
      <div className="p-6 pb-4 border-b border-neutral-50 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <IoArrowBackOutline size={22} />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Verify Prescription</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Rx Verification</h2>
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold border',
              isVerified
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-100'
            )}
          >
            {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden text-sm">
          <div className="grid grid-cols-4 bg-gray-50/50 border-b border-gray-100 py-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
            <div className="text-left pl-2">Eye</div>
            <div>SPH</div>
            <div>CYL</div>
            <div>AXIS</div>
          </div>
          <RxRow label="OD (Right)" data={right} border />
          <RxRow label="OS (Left)" data={left} />
          <div className="flex justify-between items-center px-6 py-3 border-t border-gray-100 bg-gray-50/30">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              PD (DIST)
            </span>
            <span className="text-sm font-bold text-gray-900 font-mono">{PD}mm</span>
          </div>
        </div>
        {!isVerified ? (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <Button
              onClick={onReject}
              disabled={processing}
              variant="outline"
              className="hover:bg-red-50 hover:text-red-600 border-gray-200"
              leftIcon={<IoClose size={20} />}
            >
              Reject
            </Button>
            <Button
              onClick={onApprove}
              disabled={processing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              leftIcon={<IoCheckmark size={20} />}
            >
              Approve & Verify
            </Button>
          </div>
        ) : (
          <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col items-center gap-2 text-emerald-700">
            <div className="bg-emerald-500 text-white rounded-full p-1">
              <IoCheckmark size={20} />
            </div>
            <div className="text-sm font-bold uppercase tracking-tight">Verified by Staff</div>
          </div>
        )}
      </div>
    </div>
  )
}

const RxRow = ({ label, data, border }: { label: string; data: any; border?: boolean }) => (
  <div
    className={cn(
      'grid grid-cols-4 py-3 px-4 items-center text-center hover:bg-gray-50 transition-colors',
      border && 'border-b border-gray-50'
    )}
  >
    <div className="font-bold text-gray-900 text-left pl-2">{label}</div>
    <div className="font-mono font-medium text-gray-600">{Number(data.SPH || 0).toFixed(2)}</div>
    <div className="font-mono font-medium text-gray-600">{Number(data.CYL || 0).toFixed(2)}</div>
    <div className="font-mono font-medium text-gray-600">{data.AXIS || 0}</div>
  </div>
)
