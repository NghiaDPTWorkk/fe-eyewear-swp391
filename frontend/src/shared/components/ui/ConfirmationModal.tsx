import { IoAlertCircle, IoClose } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

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
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) setShouldRender(true)
    else {
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!shouldRender) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Centered Modal Card */}
      <div
        className={`relative w-full max-w-[500px] bg-white rounded-[24px] shadow-2xl p-6 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full border ${
              type === 'danger' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-mint-50 text-mint-600 border-mint-100'
            }`}>
              {type === 'danger' ? <IoAlertCircle size={24} /> : <IoAlertCircle size={24} />}
            </div>
            <h3
              className={`text-xl font-bold tracking-tight ${
                type === 'danger' ? 'text-red-600' : 'text-slate-800'
              }`}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">
              MESSAGE
            </h4>
            <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-transform active:scale-[0.98] ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                : 'bg-mint-900 hover:bg-mint-700 shadow-mint-200'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-gray-200 hover:text-slate-900 rounded-xl font-bold transition-colors"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
