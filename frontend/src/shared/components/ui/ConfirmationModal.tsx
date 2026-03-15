import { createPortal } from 'react-dom'
import {
  IoClose,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'

import { Button } from './button'

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
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-[0_40px_130px_-20px_rgba(0,0,0,0.25)] transition-all border border-white/20 animate-in zoom-in-95 fade-in duration-500 ease-out">
        <div className="flex justify-between items-start p-6 pb-0 mb-4 shrink-0">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${styles.bg} flex items-center justify-center border ${styles.border} shadow-inner transition-transform hover:scale-105 duration-300`}
            >
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-2">
                {title}
              </h3>
              <div className={`h-1 w-8 ${styles.accent} rounded-full`}></div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90 border border-slate-100"
          >
            <IoClose size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 custom-scrollbar">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-white/60 transition-colors" />
            <div className="text-[13.5px] text-slate-700 leading-7 relative z-10 font-normal">
              {typeof message === 'string'
                ? message.split(/(IRREVERSIBLE)/g).map((part, i) =>
                    part === 'IRREVERSIBLE' ? (
                      <span
                        key={i}
                        className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100 mx-0.5"
                      >
                        IRREVERSIBLE
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                : message}
            </div>
          </div>

          {details && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Details
              </label>
              <div>{details}</div>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 flex flex-col gap-2 shrink-0">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full h-12 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all active:scale-[0.98] flex items-center justify-center border-none text-white ${styles.buttonBg}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-[2px] border-white/30 border-t-white rounded-full animate-spin" />
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
            className="w-full bg-transparent border-none text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl h-10 font-semibold text-[13px] transition-all"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
