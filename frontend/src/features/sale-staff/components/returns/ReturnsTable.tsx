import { Card, Button } from '@/components'
import { IoChevronForward, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'
import { formatPrice } from '@/shared/utils'

interface ReturnsTableProps {
  returns: ReturnTicketData[]
  isLoading: boolean
  pagination: any
  onPageChange: (page: number) => void
  onRowClick: (id: string) => void
}

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'text-orange-600 bg-orange-50 border-orange-100'
    case 'APPROVED':
      return 'text-emerald-600 bg-emerald-50 border-emerald-100'
    case 'REJECTED':
      return 'text-rose-600 bg-rose-50 border-rose-100'
    default:
      return 'text-slate-600 bg-slate-50 border-slate-100'
  }
}

export default function ReturnsTable({
  returns,
  isLoading,
  pagination,
  onPageChange,
  onRowClick
}: ReturnsTableProps) {
  return (
    <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-neutral-100">
              <th className="pl-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Return ID
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Order ID
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Reason
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Amount
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-center align-middle">
                Status
              </th>
              <th className="px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest align-middle">
                Date
              </th>
              <th className="pr-10 px-6 py-5 text-[10px] font-semibold text-[#a4a9c1] uppercase tracking-widest text-right align-middle">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50 bg-white">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-6 h-20 bg-slate-50/50" />
                </tr>
              ))
            ) : returns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No return tickets found
                </td>
              </tr>
            ) : (
              returns.map((ret) => (
                <tr
                  key={ret.id}
                  className="hover:bg-emerald-50/30 cursor-pointer group transition-all"
                  onClick={() => onRowClick(ret.id)}
                >
                  <td className="pl-10 px-6 py-6 text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors align-middle">
                    #{ret.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-blue-600/80 align-middle">
                    #{ret.orderId.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500 align-middle">
                    {ret.reason}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-700 align-middle">
                    {formatPrice(ret.money)}
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="flex justify-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border shadow-sm ${getStatusStyles(ret.status)}`}
                      >
                        {ret.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-middle">
                    <div className="text-sm font-medium text-[#3d4465]">
                      {ret.createdAt.split(' ')[1]}
                    </div>
                  </td>
                  <td className="pr-10 px-6 py-6 text-right align-middle">
                    <button
                      className="text-neutral-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all p-2 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick(ret.id)
                      }}
                    >
                      <IoChevronForward size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} returns)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-neutral-200"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="solid"
              colorScheme="primary"
              size="sm"
              className="min-w-[32px] px-2 font-semibold"
            >
              {pagination.page}
            </Button>
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-neutral-200"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
