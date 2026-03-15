import { useState } from 'react'
import { Button, Input } from '@/components'
import { IoArrowBack, IoCheckmark, IoClose } from 'react-icons/io5'
import RxImageViewer from './RxImageViewer'
import RxDataPanel from './RxDataPanel'
import { TYPOGRAPHY } from '../../constants/saleStaffDesignSystem'

interface RxValues {
  sph: string
  cyl: string
  axis: string
  add: string
  pd: string
}

interface RxImageComparatorProps {
  orderId: string
  imageUrl: string
  odData: RxValues
  osData: RxValues
  onApprove: () => void
  onReject: (reason: string) => void
  onBack: () => void
}

export default function RxImageComparator({
  orderId,
  imageUrl,
  odData,
  osData,
  onApprove,
  onReject,
  onBack
}: RxImageComparatorProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  const handleReject = () => {
    if (showRejectInput && rejectReason.trim()) {
      onReject(rejectReason)
    } else {
      setShowRejectInput(true)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-white border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30 rounded-xl shadow-sm transition-all"
          >
            <IoArrowBack className="text-gray-400 hover:text-emerald-600" size={22} />
          </button>
          <div>
            <h1 className={TYPOGRAPHY.pageTitle}>Rx Verification</h1>
            <p className={TYPOGRAPHY.pageSubtitle}>Order: {orderId}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-semibold rounded-full text-xs border border-emerald-100 uppercase tracking-wide">
          Awaiting Verification
        </span>
      </div>

      {}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {}
        <RxImageViewer imageUrl={imageUrl} />

        {}
        <RxDataPanel odData={odData} osData={osData}>
          {}
          {showRejectInput && (
            <div className="px-6 pb-4">
              <label className="text-xs font-semibold text-red-600 block mb-2">
                Rejection Reason
              </label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="border-red-200 focus:border-red-500"
              />
            </div>
          )}

          {}
          <div className="bg-neutral-50/80 p-6 flex gap-4 border-t border-neutral-100">
            <Button
              isFullWidth
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 rounded-xl shadow-md shadow-emerald-100 transition-all"
              leftIcon={<IoCheckmark size={20} />}
              onClick={onApprove}
            >
              Approve & Send to Lab
            </Button>
            <Button
              isFullWidth
              variant="outline"
              className="bg-white border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50 font-semibold h-12 rounded-xl transition-all"
              leftIcon={<IoClose size={20} />}
              onClick={handleReject}
            >
              {showRejectInput ? 'Confirm Reject' : 'Reject'}
            </Button>
          </div>
        </RxDataPanel>
      </div>
    </div>
  )
}
