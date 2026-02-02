import React from 'react'
import { cn } from '@/lib/utils'
import type { Invoice } from '../../types'

interface DashboardInvoiceRowProps {
  invoice: Invoice
  onClick: () => void
}

export const DashboardInvoiceRow: React.FC<DashboardInvoiceRowProps> = ({ invoice, onClick }) => {
  return (
    <tr
      className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <td className="px-6 py-5">
        <span className="text-sm font-bold text-primary-500">INV-{invoice.id}</span>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-700">Guest User</span>
          <span className="text-[11px] text-slate-400 font-medium">Customer</span>
        </div>
      </td>
      <td className="px-6 py-5 text-center">
        <span className="text-sm text-slate-500 font-medium">
          {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </td>
      <td className="px-6 py-5 text-right font-bold text-slate-700">
        ${invoice.totalAmount?.toLocaleString() || '0.00'}
      </td>
      <td className="px-6 py-5 text-center">
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
      </td>
    </tr>
  )
}
