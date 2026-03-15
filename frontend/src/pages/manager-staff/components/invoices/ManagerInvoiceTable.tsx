import React from 'react'
import { IoPersonCircleOutline, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { EnrichedInvoice } from '@/features/manager-staff/hooks/useAdminInvoices'

interface ManagerInvoiceTableProps {
  invoices: EnrichedInvoice[]
  isLoading: boolean
  errorMessage: string | null
  selectedInvoiceId: string | null
  onSelectInvoice: (id: string) => void
}

export const ManagerInvoiceTable: React.FC<ManagerInvoiceTableProps> = ({
  invoices,
  isLoading,
  errorMessage,
  selectedInvoiceId,
  onSelectInvoice
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50/50">
          <tr>
            <th className="px-6 py-5">Customer</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Date</th>
            <th className="px-6 py-5">Created At</th>
            <th className="px-6 py-5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-neutral-400 font-medium">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-mint-500 border-t-transparent rounded-full animate-spin" />
                  Loading Invoices...
                </div>
              </td>
            </tr>
          ) : errorMessage ? (
            <tr>
              <td colSpan={5} className="py-20 text-center text-red-500 font-medium font-primary">
                {errorMessage}
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-20 text-center text-neutral-400 font-medium font-primary"
              >
                No invoices found matching your criteria.
              </td>
            </tr>
          ) : (
            invoices.map((inv) => (
              <tr
                key={inv.id}
                className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${selectedInvoiceId === inv.id ? 'bg-mint-50/40' : ''}`}
                onClick={() => onSelectInvoice(inv.id)}
              >
                <td className="px-6 py-6 font-primary">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100 shadow-sm shrink-0">
                      <IoPersonCircleOutline size={28} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5 truncate">
                        {inv.fullName}
                      </p>
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
                        {inv.invoiceCode}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border font-primary ${
                      inv.status === InvoiceStatus.COMPLETED
                        ? 'bg-mint-50 text-mint-600 border-mint-100'
                        : inv.status === InvoiceStatus.PENDING ||
                            inv.status === InvoiceStatus.DEPOSITED
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : inv.status === InvoiceStatus.REJECTED ||
                              inv.status === InvoiceStatus.CANCELED
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-6 font-primary">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <IoCalendarOutline className="text-neutral-300" />
                    <span className="font-medium">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 font-primary">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <IoTimeOutline className="text-neutral-300" />
                    <span className="font-medium">
                      {new Date(inv.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="solid"
                    colorScheme="primary"
                    size="sm"
                    className="rounded-xl font-bold text-[11px] bg-mint-600 hover:bg-mint-700 shadow-lg shadow-mint-100 text-white uppercase tracking-wider px-4 transition-all active:scale-95 whitespace-nowrap"
                    onClick={() => onSelectInvoice(inv.id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
