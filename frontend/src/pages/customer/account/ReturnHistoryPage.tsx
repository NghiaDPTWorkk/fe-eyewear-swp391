import { useState, useEffect } from 'react'
import { Card } from '@/shared/components/ui/card'
import { returnService } from '@/features/customer/services/return.service'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'
import { Loader2, Package, Clock, ExternalLink } from 'lucide-react'
import { PriceTag } from '@/shared/components/ui/price-tag'
import { cn } from '@/lib/utils'
import OperationPagination from '@/shared/components/ui/pagination/OperationPagination'

export function ReturnHistoryPage() {
  const [tickets, setTickets] = useState<ReturnTicketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const LIMIT = 10

  const fetchTickets = async (page: number) => {
    try {
      setIsLoading(true)
      const response = await returnService.getReturnTickets(page, LIMIT)
      if (response.success) {
        setTickets(response.data.returnTicketList)
        setTotalPages(response.data.pagination.totalPages)
        setTotalItems(response.data.pagination.total)
      } else {
        setError(response.message)
      }
    } catch (err: any) {
      setError('Failed to fetch return history.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets(currentPage)
  }, [currentPage])

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100'
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-100'
      case 'REJECTED':
      case 'CANCEL':
        return 'bg-red-50 text-red-700 border-red-100'
      case 'IN_PROGRESS':
      case 'DELIVERING':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'RETURNED':
        return 'bg-gray-50 text-gray-700 border-gray-100'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-[28px] md:text-[30px] font-bold text-mint-1200 mb-2 leading-tight">
            My Returns
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Review your return requests and their current status.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
            <p className="font-bold">Fetching your returns...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 border-2 border-dashed border-danger-100 rounded-[32px] bg-danger-50/10">
            <p className="text-danger-500 font-bold mb-4">{error}</p>
            <button
              onClick={() => fetchTickets(currentPage)}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold text-sm"
            >
              Try Again
            </button>
          </div>
        ) : tickets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="p-6 border-mint-100/40 bg-white rounded-[24px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all group overflow-hidden relative"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-primary-600">
                            <Package size={20} />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-0.5">
                              Ticket ID
                            </span>
                            <span className="text-sm font-bold text-mint-1200 uppercase tracking-wider">
                              #{ticket.id.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div
                          className={cn(
                            'px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors',
                            getStatusStyle(ticket.status)
                          )}
                        >
                          {ticket.status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                              Reason: <span className="text-mint-1200">{ticket.reason}</span>
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed italic">
                              "{ticket.description}"
                            </p>
                          </div>
                          {ticket.media.length > 0 && (
                            <div className="flex -space-x-2">
                              {ticket.media.slice(0, 3).map((url, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden shadow-sm"
                                >
                                  <img src={url} className="w-full h-full object-cover" alt="" />
                                </div>
                              ))}
                              {ticket.media.length > 3 && (
                                <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                                  +{ticket.media.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-300" />
                          <span>{ticket.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <span>Order: {ticket.orderId.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price/Action */}
                    <div className="flex flex-col lg:items-end justify-between lg:min-w-[180px] pt-4 lg:pt-0 lg:border-l border-mint-50 lg:pl-10">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-1">
                          Refund Amount
                        </span>
                        <PriceTag
                          price={ticket.money}
                          className="text-2xl font-extrabold text-mint-1200 tracking-tight"
                        />
                      </div>

                      <button className="flex items-center gap-2 text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-[0.2em] group">
                        View Details
                        <ExternalLink
                          size={14}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <OperationPagination
                  page={currentPage}
                  totalPages={totalPages}
                  total={totalItems}
                  limit={LIMIT}
                  onPageChange={(p) => setCurrentPage(p)}
                  itemsOnPage={tickets.length}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="p-24 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white/50 backdrop-blur-sm rounded-[48px]">
            <div className="w-20 h-20 bg-mint-50 rounded-full flex items-center justify-center mb-6 text-mint-200">
              <Package size={40} />
            </div>
            <p className="text-xl font-bold text-mint-1200 mb-2">No return requests found</p>
            <p className="text-gray-400 text-sm font-medium">
              You haven't submitted any return requests yet.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
