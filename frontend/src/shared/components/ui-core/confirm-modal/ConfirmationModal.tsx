import { createPortal } from 'react-dom'
import {
  IoClose,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'

import { Button } from '../button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  type?: 'danger' | 'warning' | 'info'
  details?: React.ReactNode
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
  type = 'info',
  details
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <IoAlertCircleOutline size={32} className="text-rose-500" />
      case 'warning':
        return <IoWarningOutline size={32} className="text-amber-500" />
      default:
        return <IoInformationCircleOutline size={32} className="text-mint-600" />
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          buttonBg: 'bg-rose-500 hover:bg-rose-600 shadow-rose-100',
          accent: 'bg-rose-500'
        }
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          buttonBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100',
          accent: 'bg-amber-500'
        }
      default:
        return {
          bg: 'bg-mint-50',
          border: 'border-mint-100',
          buttonBg: 'bg-mint-600 hover:bg-mint-700 shadow-mint-100',
          accent: 'bg-mint-500'
        }
    }
  }

  const styles = getTypeStyles()

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] transition-all border border-neutral-100/50 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${styles.bg} flex items-center justify-center border ${styles.border} shadow-sm`}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black leading-tight tracking-tight">
                {title}
              </h3>
              <div className={`h-1 w-10 ${styles.accent} rounded-full mt-2`}></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-slate-400 hover:bg-neutral-100 transition-all border border-neutral-100 active:scale-90"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100/50">
            <p className="text-sm font-normal text-black leading-relaxed">{message}</p>
          </div>

          {details && (
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-4">
                Operation Details
              </label>
              <div className="bg-white border border-slate-100 rounded-[1.5rem] p-5 shadow-sm">
                {details}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`${styles.buttonBg} text-white w-full h-14 rounded-2xl font-semibold text-sm tracking-wide shadow-xl border-none transition-all active:scale-95 flex items-center justify-center`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
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
            className="w-full bg-white border-neutral-200 text-slate-500 hover:bg-neutral-50 rounded-2xl h-12 font-medium text-sm transition-all"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
