import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IoCloseOutline, IoFlashOutline, IoSendOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

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

    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Expedite request sent for ${order.orderCode}!`, {
      style: {
        borderRadius: '16px',
        background: '#10b981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500'
      }
    })

    setIsSubmitting(false)
    setNote('')
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-neutral-100/50 overflow-hidden animate-in zoom-in-95 duration-300">
        {}
        <div className="flex items-center justify-between p-6 border-b border-neutral-50 bg-neutral-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-mint-50 text-mint-600 rounded-xl flex items-center justify-center shadow-sm border border-mint-100/50">
              <IoFlashOutline size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 tracking-tight leading-none">
                Expedite Progress
              </h3>
              <p className="text-[9px] text-mint-600 font-medium uppercase tracking-[0.1em] mt-1.5">
                Priority Allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-neutral-100 hover:bg-neutral-50 text-slate-400 transition-all active:scale-95"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          {}
          <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-5 custom-scrollbar">
            {}
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                    Target Order
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-none">{order.orderCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                    Current Station
                  </p>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-[9px] font-semibold tracking-wider bg-white border shadow-sm',
                      order.stationColor
                        ? order.stationColor.replace('amber', 'mint').replace('yellow', 'mint')
                        : 'border-mint-200 text-mint-600'
                    )}
                  >
                    {order.station}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100/50">
                <div>
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                    Lens Details
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">{order.type}</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">{order.material}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                    Time in Station
                  </p>
                  <p className="text-[11px] font-semibold text-mint-600 font-mono tracking-tight">
                    {order.time}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-mint-50/30 rounded-xl border border-mint-100/30">
                <p className="text-[11px] font-medium text-mint-800 leading-relaxed italic">
                  Notice: Submitting this request will flag this order for immediate prioritization
                  in the lab queue.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">
                  Reason / Internal Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Customer needs for upcoming flight on Monday..."
                  className="w-full min-h-[80px] p-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-400 transition-all resize-none placeholder:text-slate-300 shadow-inner"
                  required
                />
              </div>
            </div>
          </div>

          {}
          <div className="p-6 pt-0 flex flex-col gap-2 shrink-0">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-11 bg-mint-500 hover:bg-mint-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-mint-100 transition-all flex items-center justify-center gap-2 border-none active:scale-95"
            >
              <IoSendOutline size={16} />
              Send Request
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full h-10 bg-transparent border-none text-slate-400 hover:text-slate-600 hover:bg-neutral-50 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all"
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
