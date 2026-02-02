import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Invoice } from '../../types'
import { useInvoiceAction } from '../../hooks/useInvoiceAction'
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'

interface SalesStaffDashboardRowProps {
  invoice: Invoice
  onClick: () => void
  onActionSuccess: () => void
}

export const SalesStaffDashboardRow: React.FC<SalesStaffDashboardRowProps> = ({
  invoice,
  onClick,
  onActionSuccess
}) => {
  const { approveInvoice, rejectInvoice, validateInvoiceApproval, isProcessing } =
    useInvoiceAction()
  const [isApprovable, setIsApprovable] = useState(false)
  const [isValidating, setIsValidating] = useState(true)

  useEffect(() => {
    let isMounted = true
    const checkStatus = async () => {
      if (invoice.orders && invoice.orders.length > 0) {
        const orderIds = invoice.orders.map((o) => o.id)
        const result = await validateInvoiceApproval(orderIds)
        if (isMounted) {
          setIsApprovable(result)
          setIsValidating(false)
        }
      } else {
        if (isMounted) {
          setIsApprovable(false)
          setIsValidating(false)
        }
      }
    }
    checkStatus()
    return () => {
      isMounted = false
    }
  }, [invoice.orders, validateInvoiceApproval])

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
        <span className="text-sm font-bold text-primary-600 font-mono hover:text-primary-700 hover:underline decoration-primary-300 decoration-2 underline-offset-4 transition-all">
          {invoice.invoiceCode}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{invoice.fullName}</span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">{invoice.phone}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm text-slate-500 font-medium">
            {invoice.createdAt ? invoice.createdAt.split(' ')[1] : 'N/A'}
          </span>
          <span className="text-[10px] text-slate-400">
            {invoice.createdAt ? invoice.createdAt.split(' ')[0] : ''}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-right font-bold text-slate-700">{invoice.finalPrice}</td>
      <td className="px-6 py-5">
        <div className="flex items-center justify-center">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5',
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
              isProcessing
                ? 'opacity-50 cursor-wait'
                : 'text-rose-500 hover:bg-rose-50 hover:shadow-sm hover:shadow-rose-100'
            )}
            title="Reject Invoice"
            disabled={isProcessing}
            onClick={handleReject}
          >
            <IoCloseCircleOutline size={22} />
          </button>

          {/* Approve Button */}
          <button
            className={cn(
              'p-2 rounded-xl transition-all',
              isApprovable && !isProcessing
                ? 'text-emerald-500 hover:bg-emerald-50 hover:shadow-sm hover:shadow-emerald-100'
                : 'text-neutral-300 cursor-not-allowed bg-neutral-50'
            )}
            title={
              isValidating
                ? 'Validating orders...'
                : isApprovable
                  ? 'Approve Invoice'
                  : 'All orders must be approved first'
            }
            disabled={!isApprovable || isProcessing || isValidating}
            onClick={handleApprove}
          >
            {isValidating ? (
              <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" />
            ) : (
              <IoCheckmarkCircleOutline size={22} />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
