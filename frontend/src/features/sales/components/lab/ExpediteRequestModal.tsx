import React, { useState } from 'react'
import { IoCloseOutline, IoFlashOutline, IoSendOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui-core'
import { toast } from 'react-hot-toast'

interface ExpediteRequestModalProps {
  isOpen: boolean
  onClose: () => void
  order: any | null
}

export function ExpediteRequestModal({ isOpen, onClose, order }: ExpediteRequestModalProps) {
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !order) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Expedite request sent for ${order.orderCode}!`, {
      style: {
        borderRadius: '16px',
        background: '#10b981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600'
      }
    })

    setIsSubmitting(false)
    setNote('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-50 bg-neutral-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100/50">
              <IoFlashOutline size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                Expedite Progress
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Priority Request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-neutral-100 text-slate-400 transition-all active:scale-95"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Order Info Summary */}
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Target Order
              </p>
              <p className="text-sm font-bold text-slate-900">{order.orderCode}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Current Station
              </p>
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${order.stationColor}`}
              >
                {order.station}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                By submitting this request, the lab team will be notified to prioritize this
                manufacturing order for faster completion.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                Reason / Internal Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Customer needs for upcoming flight on Monday..."
                className="w-full min-h-[120px] p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all resize-none placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-100 transition-all flex items-center justify-center gap-2 border-none"
            >
              <IoSendOutline />
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
