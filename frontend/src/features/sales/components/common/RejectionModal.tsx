import { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoAlertCircleOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui-core'
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-all duration-500 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] transition-all border border-neutral-100/50 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm shadow-rose-100/50">
              <IoAlertCircleOutline size={32} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-[0.2em] mt-2">
                Critical Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-all border border-neutral-100 active:scale-95"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100/50">
            <p className="text-sm font-normal text-black leading-relaxed line-clamp-3">{message}</p>
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

          <div className="space-y-3">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-4">
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
                'w-full h-32 px-6 py-5 bg-neutral-50 border rounded-[1.5rem] text-sm font-normal text-black transition-all focus:outline-none focus:ring-8 placeholder:text-slate-300 resize-none',
                error
                  ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500'
                  : 'border-neutral-100 focus:ring-rose-500/5 focus:border-rose-500'
              )}
            />
            {error && (
              <p className="text-[10px] font-semibold text-rose-500 ml-4 flex items-center gap-2 animate-in slide-in-from-top-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-14 font-semibold text-sm tracking-wide shadow-xl shadow-rose-100 border-none transition-all active:scale-95 disabled:grayscale flex items-center justify-center"
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
