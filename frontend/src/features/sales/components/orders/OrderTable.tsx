import React from 'react'
import {
  IoCalendarOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoLockClosedOutline
} from 'react-icons/io5'

import { Button } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { Invoice } from '@/features/sales/types'
import { cn } from '@/lib/utils'
import { InvoiceLockBadge } from './InvoiceLockBadge'

interface OrderTableProps {
  invoices: Invoice[]
  selectedInvoiceId: string | null
  setSelectedInvoiceId: (id: string | null) => void
  getStatusBadgeProps: (invoice: Invoice) => { label: string; color: string }
  handleApproveClick: (invoiceId: string) => void
  processing: boolean

  isLockedByOther?: (invoiceId: string) => boolean
}

export const OrderTable: React.FC<OrderTableProps> = ({
  invoices,
  selectedInvoiceId,
  setSelectedInvoiceId,
  getStatusBadgeProps,
  handleApproveClick,
  processing,
  isLockedByOther
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-white border-b-[0.5px] border-neutral-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Customer
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Date
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Time
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-24 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-2">
                    <IoEyeOutline size={28} className="text-neutral-200" />
                  </div>
                  <p className="font-medium text-sm">No invoices found</p>
                  <p className="text-xs">Try adjusting your filters or search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            invoices.map((inv: Invoice) => {
              const badge = getStatusBadgeProps(inv)
              const isSelected = selectedInvoiceId === inv.id
              const isLocked = isLockedByOther ? isLockedByOther(inv.id) : false
              const isReadyToApprove =
                inv.hasManufacturing &&
                inv.status === InvoiceStatus.DEPOSITED &&
                (inv.totalOrdersCount || 0) > 0 &&
                (inv.approvedOrdersCount || 0) === (inv.totalOrdersCount || 0)

              return (
                <tr
                  key={inv.id}
                  className={cn(
                    'group transition-all duration-200 cursor-pointer border-b-[0.5px] border-neutral-50 hover:bg-slate-50/50',
                    isSelected && 'bg-mint-50/30',
                    isLocked && 'bg-amber-50/30 opacity-80'
                  )}
                  onClick={() => setSelectedInvoiceId(inv.id)}
                >
                  {}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100 shadow-sm shrink-0 transition-transform group-hover:scale-105">
                        <IoPersonCircleOutline size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-700 leading-tight">
                          {inv.fullName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight">
                          {inv.invoiceCode}
                        </p>
                      </div>
                    </div>
                  </td>

                  {}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border',
                          badge.color
                        )}
                      >
                        {badge.label === 'Ready to Approve Final' && (
                          <IoShieldCheckmarkOutline size={12} />
                        )}
                        {badge.label}
                      </span>
                      <InvoiceLockBadge isLocked={isLocked} />
                    </div>
                  </td>

                  {}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <IoCalendarOutline className="text-slate-300" size={14} />
                      <span>{inv.createdAt ? inv.createdAt.split(' ')[1] : 'N/A'}</span>
                    </div>
                  </td>

                  {}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <IoTimeOutline className="text-slate-300" size={14} />
                      <span>{inv.createdAt ? inv.createdAt.split(' ')[0] : 'N/A'}</span>
                    </div>
                  </td>

                  {}
                  <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2 w-fit mx-auto">
                      {}
                      <Button
                        size="sm"
                        className={cn(
                          'rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9 transition-all active:scale-95 whitespace-nowrap border-none min-w-[140px] shadow-none',
                          isLocked
                            ? 'bg-amber-50 text-amber-400 border border-amber-100 cursor-not-allowed'
                            : isReadyToApprove
                              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 border border-emerald-200/50'
                              : 'bg-mint-500/10 hover:bg-mint-500/20 text-mint-600'
                        )}
                        onClick={() => {
                          if (isLocked) return
                          if (isReadyToApprove) handleApproveClick(inv.id)
                          else setSelectedInvoiceId(inv.id)
                        }}
                        disabled={processing || isLocked}
                        leftIcon={
                          isLocked ? (
                            <IoLockClosedOutline size={14} />
                          ) : isReadyToApprove ? (
                            <IoShieldCheckmarkOutline size={14} />
                          ) : (
                            <IoEyeOutline size={14} />
                          )
                        }
                        title={
                          isLocked
                            ? 'This invoice is being processed by another staff member'
                            : undefined
                        }
                      >
                        {isLocked ? 'LOCKED' : isReadyToApprove ? 'FINAL APPROVE' : 'VIEW DETAILS'}
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
