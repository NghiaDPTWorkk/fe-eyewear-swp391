import React from 'react'
import { cn } from '@/lib/utils'
import type { Invoice } from '../../types'
import { useSalesStaffAction } from '../../hooks/useSalesStaffAction'
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'

interface RowProps {
  invoice: Invoice
  onClick: () => void
  onActionSuccess: () => void
}

export const Row: React.FC<RowProps> = ({ invoice, onClick, onActionSuccess }) => {
  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()

  // Calculate approvable status directly from fetched data
  const approvedCount = invoice.approvedOrdersCount || 0
  const totalCount = invoice.totalOrdersCount || 0
  const isApprovable = approvedCount === totalCount && totalCount > 0

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isApprovable) return

    if (window.confirm('Are you sure you want to approve this invoice?')) {
      const success = await approveInvoice(invoice.id)
      if (success) onActionSuccess()
    }
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to reject this invoice?')) {
      const success = await rejectInvoice(invoice.id)
      if (success) onActionSuccess()
    }
  }

  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <td className="px-6 py-5">
        <span className="text-sm font-medium text-mint-600 font-mono hover:text-mint-700 transition-colors">
          {invoice.invoiceCode}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{invoice.fullName}</span>
          <span className="text-xs text-slate-400 mt-0.5">{invoice.phone}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-600">
            {invoice.createdAt ? invoice.createdAt.split(' ')[1] : 'N/A'}
          </span>
          <span className="text-xs text-slate-400">
            {invoice.createdAt ? invoice.createdAt.split(' ')[0] : ''}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-right font-medium text-slate-700">{invoice.finalPrice}</td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border flex items-center gap-1.5',
              invoice.status === 'DEPOSITED'
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-slate-50 text-slate-400 border-slate-100'
            )}
          >
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                invoice.status === 'DEPOSITED' ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'
              )}
            />
            {invoice.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <div className="flex items-center justify-end gap-2">
          {/* Reject Button */}
          <button
            className={cn(
              'p-2 rounded-xl transition-all',
              processing
                ? 'opacity-50 cursor-wait'
                : 'text-rose-500 hover:bg-rose-50 hover:shadow-sm hover:shadow-rose-100'
            )}
            title="Reject Invoice"
            disabled={processing}
            onClick={handleReject}
          >
            <IoCloseCircleOutline size={22} />
          </button>

          {/* Approve Button with Progress */}
          <button
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
              isApprovable && !processing
                ? 'text-emerald-600 hover:bg-emerald-50 hover:shadow-sm hover:shadow-emerald-100'
                : 'text-neutral-400 cursor-not-allowed bg-neutral-50'
            )}
            title={
              isApprovable ? 'Approve Invoice' : `${approvedCount}/${totalCount} orders approved`
            }
            disabled={!isApprovable || processing}
            onClick={handleApprove}
          >
            <IoCheckmarkCircleOutline size={20} />
            <span className="text-xs font-medium">
              {approvedCount}/{totalCount}
            </span>
          </button>
        </div>
      </td>
    </tr>
  )
}
