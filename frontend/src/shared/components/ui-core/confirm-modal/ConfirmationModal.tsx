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
          bg: 'bg-rose-50/50',
          border: 'border-rose-100/50',
          buttonBg:
            'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-200/50',
          accent: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
        }
      case 'warning':
        return {
          bg: 'bg-amber-50/50',
          border: 'border-amber-100/50',
          buttonBg:
            'bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200/50',
          accent: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
        }
      default:
        return {
          bg: 'bg-mint-50/50',
          border: 'border-mint-100/50',
          buttonBg:
            'bg-gradient-to-br from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 shadow-mint-200/50',
          accent: 'bg-mint-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
        }
    }
  }

  const styles = getTypeStyles()

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-[0_40px_130px_-20px_rgba(0,0,0,0.25)] transition-all border border-white/20 animate-in zoom-in-95 fade-in duration-500 ease-out">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${styles.bg} flex items-center justify-center border ${styles.border} shadow-inner transition-transform hover:scale-105 duration-300`}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-2">
                {title}
              </h3>
              <div className={`h-1 w-10 ${styles.accent} rounded-full`}></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90 border border-slate-100"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-white/60 transition-colors" />
            <div className="text-[14.5px] font-medium text-slate-600 leading-relaxed relative z-10">
              {message}
            </div>
          </div>

          {details && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4">
                Details
              </label>
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm shadow-slate-100/50">
                {details}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full h-14 rounded-2xl font-bold text-base tracking-wide shadow-xl transition-all active:scale-[0.98] flex items-center justify-center border-none text-white ${styles.buttonBg}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-transparent border-none text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl h-12 font-semibold text-sm transition-all"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
