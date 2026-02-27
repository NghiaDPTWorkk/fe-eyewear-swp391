import { createPortal } from 'react-dom'
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] transition-all border border-neutral-100/50 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight uppercase">
              {title}
            </h3>
            <div className="h-1 w-12 bg-mint-500 rounded-full mt-1"></div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-slate-400 hover:bg-neutral-100 transition-all border border-neutral-100"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-neutral-50/80 p-6 rounded-3xl border border-neutral-100/50">
            <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${
              type === 'danger'
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100'
                : 'bg-mint-600 hover:bg-mint-700 shadow-mint-100'
            } text-white w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border-none transition-all active:scale-95 flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            variant="outline"
            colorScheme="neutral"
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-white border-neutral-200 text-slate-500 hover:bg-neutral-50 rounded-2xl h-12 font-bold text-xs uppercase tracking-widest transition-all"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
