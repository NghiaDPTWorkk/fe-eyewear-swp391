import { Card, Button } from '@/components'
import { IoChevronForward, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import type { ReturnTicket } from '@/shared/types'

interface ReturnsTableProps {
  data: ReturnTicket[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  isLoading: boolean
  isError: boolean
  onRowClick: (ticket: ReturnTicket) => void
  onPageChange: (page: number) => void
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
  IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-100',
  APPROVED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 border-red-100',
  CANCEL: 'bg-gray-50 text-gray-500 border-gray-200',
  DELIVERING: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  RETURNED: 'bg-teal-50 text-teal-600 border-teal-100'
}

const REASON_LABELS: Record<string, string> = {
  DAMAGE: 'Damaged Product',
  WRONG_ITEM: 'Wrong Item',
  NOT_EXPECTED: 'Not As Expected',
  OTHER: 'Other'
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ReturnsTable({
  data,
  pagination,
  isLoading,
  isError,
  onRowClick,
  onPageChange
}: ReturnsTableProps) {
  const { page, total, totalPages } = pagination
  const startItem = (page - 1) * pagination.limit + 1
  const endItem = Math.min(page * pagination.limit, total)

  return (
    <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-neutral-100">
              <th className="pl-10 px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                Return ID
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                Order ID
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                Reason
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                SKUs
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right align-middle">
                Money
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center align-middle">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest align-middle">
                Date
              </th>
              <th className="pr-10 px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right align-middle">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-mint-500 border-t-transparent rounded-full animate-spin" />
                    Loading return tickets...
                  </div>
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-sm text-red-500">
                  Failed to load return tickets. Please try again.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-sm text-slate-400">
                  No return tickets found.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              data.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-mint-50/20 cursor-pointer group transition-all"
                  onClick={() => onRowClick(ticket)}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-semibold text-slate-900 group-hover:text-mint-600 transition-colors align-middle">
                    #{ticket.id.slice(-8)}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #{ticket.orderId.slice(-8)}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-slate-500 align-middle">
                    {REASON_LABELS[ticket.reason] || ticket.reason}
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {ticket.skus?.slice(0, 2).map((sku, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-mono"
                        >
                          {sku}
                        </span>
                      ))}
                      {ticket.skus && ticket.skus.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[11px]">
                          +{ticket.skus.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-semibold text-slate-700 text-right align-middle">
                    {ticket.money?.toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border shadow-sm ${STATUS_STYLES[ticket.status] || 'bg-gray-50 text-gray-500 border-gray-200'}`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-slate-600">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-slate-300 hover:text-mint-500 hover:bg-mint-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick(ticket)
                      }}
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && data.length > 0 && (
        <div className="p-6 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400 font-medium">
          <span>
            Showing {startItem} to {endItem} of {total} returns
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-slate-200 rounded-xl"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <IoChevronBackOutline />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-1 text-slate-300">…</span>}
                    <Button
                      variant={p === page ? 'solid' : 'outline'}
                      colorScheme={p === page ? 'primary' : 'neutral'}
                      size="sm"
                      className={`min-w-[32px] px-2 font-bold rounded-xl ${p === page ? 'bg-mint-500 text-white' : 'border-slate-200'}`}
                      onClick={() => onPageChange(p)}
                    >
                      {p}
                    </Button>
                  </span>
                )
              })}
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-slate-200 rounded-xl"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
