import React from 'react'
import { createPortal } from 'react-dom'
import { IoClose, IoArrowForward } from 'react-icons/io5'
import type { Invoice } from '../../types'
import { StatusBadge } from '../common'
import { Button } from '@/components'

interface InvoiceOrdersDrawerProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
}

export const InvoiceOrdersDrawer: React.FC<InvoiceOrdersDrawerProps> = ({
  isOpen,
  onClose,
  invoice
}) => {
  if (!isOpen || !invoice) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 font-heading">Invoice Details</h2>
              <span className="text-[11px] font-bold text-primary-600 bg-primary-100/50 px-2.5 py-1 rounded-lg border border-primary-200/50 font-mono tracking-tight">
                {invoice.invoiceCode}
              </span>
            </div>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Customer: <span className="font-bold text-slate-800">{invoice.fullName}</span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-slate-500">{invoice.phone}</span>
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-95"
          >
            <IoClose size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-neutral-50/30">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.15em] font-bold text-slate-400 flex items-center gap-2">
                Orders Summary
              </h3>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                {invoice.orders?.length || 0} ITEMS
              </span>
            </div>

            <div className="space-y-4">
              {invoice.orders?.map((order, idx) => (
                <div
                  key={order.id}
                  className="group relative bg-white border border-neutral-100 rounded-2xl p-5 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/20 transition-all cursor-pointer ring-1 ring-transparent hover:ring-primary-100"
                  onClick={() => {
                    window.location.href = `/salestaff/orders?invoiceId=${invoice.id}&orderId=${order.id}`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">
                          Order #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-[15px] font-bold text-slate-900 group-hover:text-primary-700 transition-colors font-heading tracking-tight">
                        {order.type.join(' & ')}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-50">
                    <span className="text-[12px] text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                      Click to view details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                      <IoArrowForward
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-5 shadow-sm">
            <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest border-b border-neutral-50 pb-3">
              Billing Information
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-slate-500 font-medium">Final Price</span>
                <span className="font-bold text-primary-700 text-lg font-heading">
                  {invoice.finalPrice}
                </span>
              </div>
              <div className="flex justify-between gap-6 text-[14px]">
                <span className="text-slate-500 font-medium whitespace-nowrap">
                  Shipping Address
                </span>
                <span className="text-slate-700 font-semibold text-right leading-relaxed">
                  {invoice.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 bg-white">
          <button
            onClick={() => (window.location.href = `/salestaff/orders?invoiceId=${invoice.id}`)}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-[14px] shadow-lg shadow-primary-100 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 tracking-tight group"
          >
            Manage All Orders in Invoice
            <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
