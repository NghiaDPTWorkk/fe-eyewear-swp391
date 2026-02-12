import React from 'react'
import {
  IoCalendarOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoEyeOutline
} from 'react-icons/io5'
import { Button } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import type { Invoice } from '@/features/sales/types'

interface OrderTableProps {
  invoices: Invoice[]
  selectedInvoiceId: string | null
  setSelectedInvoiceId: (id: string | null) => void
  getStatusBadgeProps: (invoice: Invoice) => { label: string; color: string }
  handleApproveClick: (invoiceId: string) => void
  processing: boolean
}

export const OrderTable: React.FC<OrderTableProps> = ({
  invoices,
  selectedInvoiceId,
  setSelectedInvoiceId,
  getStatusBadgeProps,
  handleApproveClick,
  processing
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50/80 to-neutral-50/80 border-b border-neutral-200/60">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Invoice & Customer
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Date
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Time
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-24 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-2">
                    <IoEyeOutline size={28} className="text-neutral-300" />
                  </div>
                  <p className="text-neutral-400 font-medium text-sm">No invoices found</p>
                  <p className="text-neutral-300 text-xs">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            invoices.map((inv: Invoice, index: number) => {
              const badge = getStatusBadgeProps(inv)
              const isSelected = selectedInvoiceId === inv.id
              return (
                <tr
                  key={inv.id}
                  className={`
                    group transition-all duration-200 cursor-pointer border-b border-neutral-100/80
                    ${
                      isSelected
                        ? 'bg-mint-50/50 border-l-2 border-l-mint-500'
                        : index % 2 === 0
                          ? 'bg-white hover:bg-slate-50/70'
                          : 'bg-neutral-50/30 hover:bg-slate-50/70'
                    }
                  `}
                  onClick={() => setSelectedInvoiceId(inv.id)}
                >
                  {/* Customer */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-mint-50 to-emerald-50 flex items-center justify-center text-mint-600 border border-mint-100/80 shadow-sm shrink-0 group-hover:shadow-md group-hover:scale-105 transition-all">
                        <IoPersonCircleOutline size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight mb-1 truncate group-hover:text-mint-700 transition-colors">
                          {inv.fullName}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 tracking-wide truncate font-mono">
                          {inv.invoiceCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm ${badge.color}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60" />
                      {badge.label}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <IoCalendarOutline className="text-slate-300" size={15} />
                      <span className="font-medium">
                        {new Date(inv.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <IoTimeOutline className="text-slate-300" size={15} />
                      <span className="font-medium">
                        {new Date(inv.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      {(inv.totalOrdersCount || 0) > 0 &&
                        inv.approvedOrdersCount === inv.totalOrdersCount &&
                        inv.status === InvoiceStatus.DEPOSITED && (
                          <button
                            className="p-2.5 text-emerald-500 hover:text-white hover:bg-emerald-500 rounded-xl transition-all duration-200 border border-emerald-100 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
                            title="Approve Invoice"
                            onClick={() => handleApproveClick(inv.id)}
                            disabled={processing}
                          >
                            <IoShieldCheckmarkOutline size={16} />
                          </button>
                        )}

                      <Button
                        size="sm"
                        className="rounded-xl font-bold text-[10px] bg-gradient-to-r from-mint-500 to-emerald-500 hover:from-mint-600 hover:to-emerald-600 text-white shadow-md shadow-mint-500/20 uppercase tracking-widest px-5 h-9 transition-all active:scale-95 whitespace-nowrap border-none hover:shadow-lg hover:shadow-mint-500/30"
                        onClick={() => setSelectedInvoiceId(inv.id)}
                      >
                        {inv.orders?.some((o) =>
                          (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
                            String(t).includes(OrderType.MANUFACTURING)
                          )
                        )
                          ? `${inv.approvedOrdersCount}/${inv.totalOrdersCount} `
                          : ''}
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
