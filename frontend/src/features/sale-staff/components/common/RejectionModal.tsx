import { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoAlertCircleOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui'
import { cn } from '@/lib/utils'

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (note: string) => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  initialNote?: string
  details?: React.ReactNode
}

export function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Reject Invoice',
  message = 'Please provide a reason for rejecting this invoice. This action cannot be undone.',
  confirmText = 'Reject Invoice',
  cancelText = 'Cancel',
  isLoading = false,
  initialNote = '',
  details
}: RejectionModalProps) {
  const [note, setNote] = useState(initialNote)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = () => {
    if (!note.trim()) {
      setError('A rejection reason is required')
      return
    }
    onConfirm(note.trim())
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] transition-all border border-neutral-100/50 animate-in zoom-in-95 duration-300">
        {}
        <div className="flex justify-between items-start p-6 pb-0 mb-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm shadow-rose-100/50">
              <IoAlertCircleOutline size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-[9px] font-semibold text-rose-500 uppercase tracking-[0.2em] mt-1.5">
                Critical Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-all border border-neutral-100 active:scale-95"
          >
            <IoClose size={20} />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 custom-scrollbar">
          <div className="bg-neutral-50 p-5 rounded-[1.5rem] border border-neutral-100/50">
            <p className="text-[13.5px] font-normal text-black leading-relaxed">{message}</p>
          </div>

          {details && (
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-2">
                Operation Details
              </label>
              <div className="bg-white border border-slate-100 rounded-[1.25rem] p-4 shadow-sm">
                {details}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-2">
              Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                if (e.target.value.trim()) setError(null)
              }}
              placeholder="e.g., Wrong detail in prescription, missing documents..."
              className={cn(
                'w-full h-28 px-5 py-4 bg-neutral-50 border rounded-[1.25rem] text-[13.5px] font-normal text-black transition-all focus:outline-none focus:ring-8 placeholder:text-slate-300 resize-none',
                error
                  ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-neutral-100 focus:ring-rose-500/5 focus:border-rose-500'
              )}
            />
            {error && (
              <p className="text-[10px] font-semibold text-rose-500 ml-2 flex items-center gap-2 animate-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {error}
              </p>
            )}
          </div>
        </div>

        {}
        <div className="p-6 pt-4 flex flex-col gap-2 shrink-0">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 font-semibold text-sm tracking-wide shadow-lg shadow-rose-100 border-none transition-all active:scale-95 disabled:grayscale flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-[2px] border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full bg-transparent border-none text-slate-400 hover:text-slate-600 hover:bg-neutral-50 rounded-xl h-10 font-semibold text-[13px] transition-all"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
