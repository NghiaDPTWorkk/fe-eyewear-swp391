import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import PrescriptionVerification from './PrescriptionVerification'

export interface PrescriptionData {
  od: {
    sph: string
    cyl: string
    axis: string
    add: string
  }
  os: {
    sph: string
    cyl: string
    axis: string
    add: string
  }
  pd: string
  lensType: string
  coatings: string[]
}

interface PrescriptionConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  prescriptionImages?: string[]
  prescriptionData?: PrescriptionData
  onApprove: (data: PrescriptionData, notes: string) => void
  onReject: (reason: string) => void
  onRequestClarification: (message: string) => void
}

export default function PrescriptionConfirmationModal({
  isOpen,
  onClose,
  orderId
}: PrescriptionConfirmationModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header/Close Button Overlay */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
        >
          <IoClose size={24} />
        </button>

        {/* Content - Using PrescriptionVerification component */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <PrescriptionVerification orderId={orderId} onBack={onClose} />
        </div>
      </div>
    </div>,
    document.body
  )
}
