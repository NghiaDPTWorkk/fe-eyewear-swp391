import React from 'react'
import { IoLockClosedOutline } from 'react-icons/io5'
import { cn } from '@/lib/utils'

interface InvoiceLockBadgeProps {
  isLocked: boolean
  className?: string
}

export const InvoiceLockBadge: React.FC<InvoiceLockBadgeProps> = ({ isLocked, className }) => {
  if (!isLocked) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md',
        'bg-amber-50 border border-amber-200/70 text-amber-600',
        'text-[9px] font-bold uppercase tracking-wider',
        'animate-pulse',
        className
      )}
      title="Another staff member is currently processing this invoice"
    >
      <IoLockClosedOutline size={9} />
      <span>In Use</span>
    </div>
  )
}

interface LockBlockedModalProps {
  isOpen: boolean
  invoiceId: string | null
  onClose: () => void
}

export const LockBlockedModal: React.FC<LockBlockedModalProps> = ({
  isOpen,
  invoiceId,
  onClose
}) => {
  if (!isOpen || !invoiceId) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
      {}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {}
      <div
        className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-3xl shadow-2xl shadow-amber-100/50 border border-amber-100 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <IoLockClosedOutline size={32} className="text-amber-500" />
          </div>
        </div>

        {}
        <h3 className="text-center text-base font-bold text-slate-800 mb-2">Invoice Locked</h3>

        {}
        <p className="text-center text-sm text-slate-500 leading-relaxed mb-1">
          Another staff member is currently processing this invoice.
        </p>
        <p className="text-center text-xs text-slate-400 mb-6">
          Please wait until they finish or the lock expires automatically.
        </p>

        {}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-500 tracking-tight">
            {invoiceId}
          </span>
        </div>

        {}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition-colors"
        >
          OK, I'll Wait
        </button>
      </div>
    </div>
  )
}
