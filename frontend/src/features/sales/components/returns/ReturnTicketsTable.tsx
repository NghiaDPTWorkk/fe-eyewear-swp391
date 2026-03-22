import {
  IoEyeOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline,
  IoCalendarOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { type ReturnTicketData } from '@/shared/types/return-ticket.types'
import ReturnTicketStatusBadge from './ReturnTicketStatusBadge'
import { Pagination } from '../common'
import { Button } from '@/shared/components/ui-core/button'
import { cn } from '@/lib/utils'

interface ReturnTicketsTableProps {
  tickets: ReturnTicketData[]
  isLoading: boolean
  error: string | null
  currentStaffId: string
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onRowClick: (ticket: ReturnTicketData) => void
  onVerifyClick: (ticket: ReturnTicketData) => void
  onPageChange: (page: number) => void
  showAction?: boolean
}

export default function ReturnTicketsTable({
  tickets,
  isLoading,
  error,
  currentStaffId,
  pagination,
  onRowClick,
  onVerifyClick,
  onPageChange,
  showAction = true
}: ReturnTicketsTableProps) {
  return (
    <div className="bg-white">
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
              {showAction && (
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td
                    colSpan={showAction ? 5 : 4}
                    className="px-6 py-6 border-b-[0.5px] border-neutral-50"
                  >
                    <div className="h-4 bg-slate-50 rounded-full w-3/4" />
                  </td>
                </tr>
              ))}

            {!isLoading && error && (
              <tr>
                <td colSpan={showAction ? 5 : 4} className="px-6 py-16 text-center">
                  <p className="text-sm font-medium text-slate-400">{error}</p>
                </td>
              </tr>
            )}

            {!isLoading && !error && tickets.length === 0 && (
              <tr>
                <td colSpan={showAction ? 5 : 4} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-2">
                      <IoEyeOutline size={28} className="text-neutral-200" />
                    </div>
                    <p className="font-medium text-sm">No return tickets found</p>
                    <p className="text-xs">Try adjusting your filters or search criteria</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              tickets.map((ticket) => {
                const isUnassigned = !ticket.staffVerify
                const isMine = ticket.staffVerify === currentStaffId
                const isActionable = ticket.status === 'PENDING'

                const parts = (ticket.createdAt || '').split(' ')
                const timePart = parts[0] || '--:--'
                const datePart = parts[1] || 'N/A'

                return (
                  <tr
                    key={ticket.id}
                    onClick={() => onRowClick(ticket)}
                    className="group transition-all duration-200 cursor-pointer border-b-[0.5px] border-neutral-50 hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100 shadow-sm shrink-0 transition-transform group-hover:scale-105">
                          <IoPersonCircleOutline size={24} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-700 leading-tight">
                            {ticket.customerId || 'Customer'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight uppercase">
                            TKT-{ticket.id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <ReturnTicketStatusBadge status={ticket.status} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <IoCalendarOutline className="text-slate-300" size={14} />
                        <span>{datePart}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <IoTimeOutline className="text-slate-300" size={14} />
                        <span>{timePart}</span>
                      </div>
                    </td>

                    {showAction && (
                      <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2 w-fit mx-auto">
                          <Button
                            size="sm"
                            className={cn(
                              'rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9 transition-all active:scale-95 whitespace-nowrap border-none min-w-[140px] shadow-none',
                              isActionable
                                ? isUnassigned
                                  ? 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-600'
                                  : isMine
                                    ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 border border-emerald-200/50'
                                    : 'bg-amber-50 text-amber-500' // Should not happen with filter
                                : 'bg-mint-500/10 hover:bg-mint-500/20 text-mint-600'
                            )}
                            onClick={() => {
                              if (isActionable && (isUnassigned || isMine)) {
                                onVerifyClick(ticket)
                              } else {
                                onRowClick(ticket)
                              }
                            }}
                            leftIcon={
                              isActionable ? (
                                isUnassigned ? (
                                  <IoShieldCheckmarkOutline size={14} />
                                ) : isMine ? (
                                  <IoShieldCheckmarkOutline size={14} />
                                ) : (
                                  <IoEyeOutline size={14} />
                                )
                              ) : (
                                <IoEyeOutline size={14} />
                              )
                            }
                          >
                            {isActionable
                              ? isUnassigned
                                ? 'CLAIM'
                                : isMine
                                  ? 'VERIFY'
                                  : 'IN REVIEW'
                              : 'DETAILS'}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && tickets.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
