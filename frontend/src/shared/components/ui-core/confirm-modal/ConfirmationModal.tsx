import { IoClose } from 'react-icons/io5'

import { Button } from '../button'

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
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-7 text-left align-middle shadow-2xl transition-all border border-neutral-100 scale-100 opacity-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{title}</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-mint-500 hover:bg-mint-100 transition-all border border-mint-200/50"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="mb-8">
            <div className="bg-neutral-50/50 p-5 rounded-2xl border border-neutral-100/50">
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              colorScheme="neutral"
              onClick={onClose}
              disabled={isLoading}
              className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl px-5 h-11 font-bold"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${
                type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-mint-600 hover:bg-mint-700'
              } text-white px-8 h-11 rounded-xl font-bold shadow-md shadow-mint-100 border-none transition-all active:scale-95`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
