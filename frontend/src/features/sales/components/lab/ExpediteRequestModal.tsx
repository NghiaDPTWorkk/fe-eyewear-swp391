import React, { useState } from 'react'
import { createPortal } from 'react-dom'
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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-neutral-100/50 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-neutral-50 bg-neutral-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100/50">
              <IoFlashOutline size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                Expedite Progress
              </h3>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-[0.2em] mt-2">
                Priority Allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-neutral-100 hover:bg-neutral-50 text-slate-400 transition-all active:scale-95"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Order Info Summary */}
          <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Target Order
              </p>
              <p className="text-base font-bold text-slate-900">{order.orderCode}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                Current Station
              </p>
              <span
                className={`px-3 py-1 rounded-xl text-[10px] font-bold tracking-widest bg-white border shadow-sm ${order.stationColor}`}
              >
                {order.station}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-amber-50/30 rounded-2xl border border-amber-100/30">
              <p className="text-xs font-bold text-amber-800 leading-relaxed italic">
                Notice: Submitting this request will flag this order for immediate prioritization in
                the lab queue.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-2">
                Reason / Internal Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Customer needs for upcoming flight on Monday..."
                className="w-full min-h-[140px] p-6 bg-neutral-50 border border-neutral-100 rounded-[2rem] text-sm font-medium text-slate-700 focus:outline-none focus:ring-8 focus:ring-amber-500/10 focus:border-amber-400 transition-all resize-none placeholder:text-slate-300 shadow-inner"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-100 transition-all flex items-center justify-center gap-2 border-none active:scale-95"
            >
              <IoSendOutline className="text-lg" />
              Send Request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full h-12 bg-white border-neutral-200 text-slate-500 hover:bg-neutral-50 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest transition-all"
            >
              Dismiss
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
