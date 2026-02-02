import React from 'react'
import { cn } from '@/lib/utils'
import type { Invoice } from '../../types'

interface SalesStaffDashboardRowProps {
  invoice: Invoice
  onClick: () => void
  onApprove: (e: React.MouseEvent) => void
}

export const SalesStaffDashboardRow: React.FC<SalesStaffDashboardRowProps> = ({
  invoice,
  onClick,
  onApprove
}) => {
  const isApprovable =
    invoice.orders.length > 0 && invoice.orders.every((o) => o.status === 'APPROVED')

  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <td className="px-6 py-5">
        <span className="text-sm font-bold text-primary-500">{invoice.invoiceCode}</span>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">{invoice.fullName}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-slate-400 font-medium">{invoice.phone}</span>
            <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-md font-bold">
              {invoice.approvedOrdersCount}/{invoice.totalOrdersCount} Approved
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="text-sm text-slate-500 font-medium">
          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </td>
      <td className="px-6 py-5 text-right font-bold text-slate-700">{invoice.finalPrice}</td>
      <td className="px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-3">
          <span
            className={cn(
              'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
              invoice.status === 'DEPOSITED'
                ? 'bg-emerald-50 text-emerald-500 border-emerald-100'
                : 'bg-slate-50 text-slate-400 border-slate-100'
            )}
          >
            {invoice.status}
          </span>
          {/* Approve Button */}
          <button
            className={cn(
              'p-2 rounded-lg transition-all',
              isApprovable
                ? 'text-emerald-600 hover:bg-emerald-50 bg-emerald-50/20'
                : 'text-neutral-300 cursor-not-allowed bg-neutral-50'
            )}
            title={isApprovable ? 'Approve Invoice' : 'All orders must be approved first'}
            disabled={!isApprovable}
            onClick={(e) => {
              e.stopPropagation()
              onApprove(e)
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}
