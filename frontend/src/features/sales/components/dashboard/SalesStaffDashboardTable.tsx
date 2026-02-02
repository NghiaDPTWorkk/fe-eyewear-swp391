import React from 'react'
import type { Invoice } from '../../types'
import { SalesStaffDashboardRow } from './SalesStaffDashboardRow'

interface SalesStaffDashboardTableProps {
  invoices: Invoice[]
  onInvoiceClick: (invoice: Invoice) => void
  onActionSuccess: () => void
  loading?: boolean
}

export const SalesStaffDashboardTable: React.FC<SalesStaffDashboardTableProps> = ({
  invoices,
  onInvoiceClick,
  onActionSuccess,
  loading
}) => {
  if (loading)
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse mt-4">Fetching invoices...</p>
      </div>
    )

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead className="bg-white border-b border-neutral-100 text-[10px] uppercase text-slate-400 font-bold tracking-widest">
          <tr>
            <th className="px-6 py-5">Invoice Code</th>
            <th className="px-6 py-5">Customer Details</th>
            <th className="px-6 py-5">Created At</th>
            <th className="px-6 py-5 text-right">Final Price</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {invoices.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-20 text-center text-gray-400 font-medium bg-neutral-50/20"
              >
                No deposited invoices found in current cycle.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <SalesStaffDashboardRow
                key={invoice.id}
                invoice={invoice}
                onClick={() => onInvoiceClick(invoice)}
                onActionSuccess={onActionSuccess}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
