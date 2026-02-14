import { useState } from 'react'
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
  isLoading?: boolean
  initialNote?: string
}

export function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Reject Invoice',
  message = 'Please provide a reason for rejecting this invoice. This action cannot be undone.',
  confirmText = 'Reject Invoice',
  isLoading = false,
  initialNote = ''
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

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-2xl transition-all border border-neutral-100 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                <IoAlertCircleOutline size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{title}</h3>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                  Action Required
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-neutral-50 flex items-center justify-center text-neutral-400 transition-all"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-neutral-50/50 p-5 rounded-3xl border border-neutral-100/50">
              <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                "{message}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value)
                  if (e.target.value.trim()) setError(null)
                }}
                placeholder="e.g., Wrong detail in prescription, missing documents..."
                className={cn(
                  'w-full h-32 px-5 py-4 bg-white border rounded-3xl text-sm transition-all focus:outline-none focus:ring-4 placeholder:text-slate-300 resize-none',
                  error
                    ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500'
                    : 'border-neutral-200 focus:ring-mint-500/10 focus:border-mint-500'
                )}
              />
              {error && (
                <p className="text-[10px] font-semibold text-rose-500 ml-4 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl h-14 font-bold transition-all active:scale-95"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-[1.5] bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-14 font-bold shadow-lg shadow-rose-200 border-none transition-all active:scale-95 disabled:grayscale"
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
          </div>
        </div>
      </div>
    </div>
  )
}
