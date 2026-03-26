import { useState } from 'react'
import { Button } from '@/components'
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5'

interface CreatePreOrderModalProps {
  isOpen: boolean
  preOrderId: string | null
  onClose: () => void
  onConfirm: (preOrderId: string) => void
}

export default function CreatePreOrderModal({
  isOpen,
  preOrderId,
  onClose,
  onConfirm
}: CreatePreOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !preOrderId) return null

  const handleConfirm = async () => {
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm(preOrderId)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        {}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Create Order Request</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="text-gray-400" size={20} />
          </button>
        </div>

        {}
        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
            <IoCheckmarkCircle className="text-emerald-500 text-2xl shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pre-Order: {preOrderId}</p>
              <p className="text-xs text-gray-500 mt-1">
                This will create an order and hand it over to the Packaging Department.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Note:</span> Once confirmed, the order will be queued
              for packaging. The customer will be notified automatically.
            </p>
          </div>
        </div>

        {}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <Button
            variant="outline"
            colorScheme="neutral"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            onClick={handleConfirm}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Confirm & Create'}
          </Button>
        </div>
      </div>
    </div>
  )
}
