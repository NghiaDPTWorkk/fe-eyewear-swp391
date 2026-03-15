import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IoCloseOutline, IoReceiptOutline } from 'react-icons/io5'

import { Button } from '@/shared/components/ui'
import type { AdminInvoiceListItem } from '@/shared/types'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'

import ManagerInvoiceCard from './ManagerInvoiceCard'

interface ManagerOrderDrawerProps {
  isOpen: boolean
  onClose: () => void
  invoice: AdminInvoiceListItem | null
  isOnboarding: boolean
  onOnboard: (id: string) => Promise<unknown>
  onComplete: (id: string) => Promise<unknown>
  onDelivering: (id: string) => Promise<unknown>
}

export const ManagerOrderDrawer: React.FC<ManagerOrderDrawerProps> = ({
  isOpen,
  onClose,
  invoice,
  isOnboarding,
  onOnboard,
  onComplete,
  onDelivering
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !invoice) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end">
      {}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-2xl h-full bg-neutral-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        {}
        <div className="p-6 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-mint-50 flex items-center justify-center text-mint-600 shadow-sm border border-mint-100">
              <IoReceiptOutline size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-heading">Invoice Details</h3>
              <p className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">
                {invoice.invoiceCode}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-mint-50 flex items-center justify-center text-neutral-500 hover:text-mint-600 transition-colors"
          >
            <IoCloseOutline size={28} />
          </Button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ManagerInvoiceCard
            invoice={invoice}
            isExpanded={true}
            isOnboarding={isOnboarding}
            onToggleExpanded={() => {}}
            onOnboard={onOnboard}
            onComplete={onComplete}
            onDelivering={onDelivering}
            showOnboardButton={
              invoice.status === InvoiceStatus.APPROVED ||
              invoice.status === InvoiceStatus.DEPOSITED
            }
            hideActions={false}
          />
        </div>

        {}
        <div className="p-6 bg-white border-t border-neutral-100 items-center justify-between flex shrink-0">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest leading-none">
            Last Updated: {new Date(invoice.createdAt).toLocaleString()}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ManagerOrderDrawer
