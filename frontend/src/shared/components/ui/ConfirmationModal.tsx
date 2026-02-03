import { IoAlertCircle, IoClose } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'info'
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-neutral-100 scale-100 opacity-100">
          <div className="flex justify-between items-start mb-4">
            <h3
              className={`text-lg font-bold leading-6 ${
                type === 'danger' ? 'text-red-600' : 'text-gray-900'
              } flex items-center gap-2`}
            >
              {type === 'danger' && <IoAlertCircle size={24} />}
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-500 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              {message}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-mint-900 hover:bg-mint-700 text-white'
              } px-6`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
