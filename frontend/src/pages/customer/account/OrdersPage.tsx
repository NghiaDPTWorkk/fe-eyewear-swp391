import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '@/shared/components/ui/card'
import { OrderCard } from '@/components/layout/customer/account/orders/OrderCard'
import { cn } from '@/lib/utils'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import type { Invoice } from '@/shared/types/invoice.types'
import { Loader2, Package, Clock } from 'lucide-react'
import OperationPagination from '@/shared/components/ui/pagination/OperationPagination'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { returnService } from '@/features/customer/services/return.service'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'
import { PriceTag } from '@/shared/components/ui/price-tag'

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'delivering', label: 'Delivering' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' }
]

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeView = searchParams.get('view') || 'active'
  const activeTab = searchParams.get('tab') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [returnTickets, setReturnTickets] = useState<ReturnTicketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingInvoiceId, setCancellingInvoiceId] = useState<string | null>(null)

  const [returnPagination, setReturnPagination] = useState({
    total: 0,
    totalPages: 1
  })

  const handleViewChange = (view: string) => {
    setSearchParams({ view, tab: 'all', page: '1' }, { replace: true })
  }

  const handleTabChange = (tabId: string) => {
    setSearchParams({ view: activeView, tab: tabId, page: '1' }, { replace: true })
  }

  const handlePageChange = (page: number) => {
    setSearchParams({ view: activeView, tab: activeTab, page: page.toString() }, { replace: true })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        if (activeView === 'returns') {
          const response = await returnService.getReturnTickets(currentPage, 10)
          if (response.success) {
            setReturnTickets(response.data.returnTicketList)
            setReturnPagination({
              total: response.data.pagination.total,
              totalPages: response.data.pagination.totalPages
            })
          } else {
            setError(response.message)
          }
        } else {
          const response = await invoiceService.getInvoices({
            page: 1,
            limit: 100
          })
          if (response.success) {
            const detailedResults = await Promise.all(
              response.data.data.map((inv) => invoiceService.getInvoiceDetail(inv._id))
            )
            const mergedInvoices = response.data.data.map((inv, index) => {
              const detailRes = detailedResults[index]
              return {
                ...inv,
                productList: detailRes.success ? detailRes.data.productList : []
              }
            })
            setInvoices(mergedInvoices)
          } else {
            setError(response.message)
          }
        }
      } catch (err: any) {
        setError('Failed to fetch data. Please try again later.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activeView, activeTab, currentPage])

  const filteredInvoices = invoices.filter((inv) => {
    const status = inv.status as InvoiceStatus
    if (activeTab === 'all') return true
    if (activeTab === 'pending')
      return status === InvoiceStatus.PENDING || status === InvoiceStatus.DEPOSITED
    if (activeTab === 'confirmed') return status === InvoiceStatus.APPROVED
    if (activeTab === 'processing') {
      return [
        InvoiceStatus.WAITING_ASSIGN,
        InvoiceStatus.ONBOARD,
        InvoiceStatus.COMPLETED,
        InvoiceStatus.READY_TO_SHIP
      ].includes(status)
    }
    if (activeTab === 'delivering') return status === InvoiceStatus.DELIVERING
    if (activeTab === 'delivered') return status === InvoiceStatus.DELIVERED
    if (activeTab === 'cancelled') {
      return [
        InvoiceStatus.CANCELED,
        InvoiceStatus.CANCEL,
        InvoiceStatus.REJECTED,
        InvoiceStatus.REFUNDED
      ].includes(status)
    }
    return true
  })

  // Pagination logic ở client
  const totalPagesLocal =
    activeView === 'returns' ? returnPagination.totalPages : Math.ceil(filteredInvoices.length / 3)

  const paginatedInvoices =
    activeView === 'returns' ? [] : filteredInvoices.slice((currentPage - 1) * 3, currentPage * 3)

  const canCancelInvoice = (status: InvoiceStatus) => {
    return [InvoiceStatus.PENDING, InvoiceStatus.DEPOSITED, InvoiceStatus.APPROVED].includes(status)
  }

  const handleCancelInvoice = async (invoiceId: string) => {
    if (!invoiceId || cancellingInvoiceId) return

    try {
      setCancellingInvoiceId(invoiceId)
      const response = await invoiceService.cancelInvoice(invoiceId)

      if (response.success) {
        toast.success(response.message || 'Invoice cancelled successfully')

        setInvoices((prev) =>
          prev.map((inv) =>
            inv._id === invoiceId
              ? {
                  ...inv,
                  status: InvoiceStatus.CANCELED
                }
              : inv
          )
        )
      } else {
        toast.error(response.message || 'Unable to cancel this invoice')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel invoice')
    } finally {
      setCancellingInvoiceId(null)
    }
  }

  const getReturnStatusStyle = (status: string) => {
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
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-[28px] md:text-[30px] font-bold text-mint-1200 mb-2 leading-tight">
            My Orders
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Track your latest eyewear and view your order history.
          </p>
        </div>

        {/* Sleek Segmented Control */}
        <div className="flex bg-mint-50/50 p-1 rounded-xl border border-mint-100/50 self-start md:self-auto">
          <button
            onClick={() => handleViewChange('active')}
            className={cn(
              'px-6 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all',
              activeView === 'active'
                ? 'bg-white text-primary-600 shadow-sm border border-mint-100/10'
                : 'text-gray-400 hover:text-mint-1200'
            )}
          >
            Active
          </button>
          <button
            onClick={() => handleViewChange('returns')}
            className={cn(
              'px-6 py-2 text-[10px] font-bold uppercase tracking-[0.1em] rounded-lg transition-all',
              activeView === 'returns'
                ? 'bg-white text-primary-600 shadow-sm border border-mint-100/10'
                : 'text-gray-400 hover:text-mint-1200'
            )}
          >
            Returns
          </button>
        </div>
      </div>

      {/* Modern Tabs with Cleaner Spacing */}
      {activeView === 'active' && (
        <div className="flex gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide border-b border-mint-50">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all relative group whitespace-nowrap',
                  isActive ? 'text-mint-1200' : 'text-gray-400 hover:text-mint-800'
                )}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Order List */}
      <div className="flex flex-col gap-2 min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
            <p className="font-bold">Fetching your orders...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 border-2 border-dashed border-danger-100 rounded-[32px] bg-danger-50/10">
            <p className="text-danger-500 font-bold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-500 text-white rounded-xl font-bold text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (activeView === 'returns' ? returnTickets.length > 0 : paginatedInvoices.length > 0) ? (
          <>
            <div className="flex flex-col gap-4">
              {activeView === 'returns'
                ? returnTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="p-6 border-mint-100/40 bg-white rounded-[24px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all group overflow-hidden relative"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-primary-600">
                                <Package size={20} />
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-0.5">
                                  Return Ticket
                                </span>
                                <span className="text-sm font-bold text-mint-1200 uppercase tracking-wider">
                                  #{ticket.id.slice(-8).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div
                              className={cn(
                                'px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-colors',
                                getReturnStatusStyle(ticket.status)
                              )}
                            >
                              {ticket.status}
                            </div>
                          </div>

                          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                  Reason:{' '}
                                  <span className="text-mint-1200 font-extrabold">
                                    {ticket.reason}
                                  </span>
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
                                      <img
                                        src={url}
                                        className="w-full h-full object-cover"
                                        alt=""
                                      />
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

                          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
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

                        <div className="flex flex-col lg:items-end justify-between lg:min-w-[180px] border-t lg:border-t-0 lg:border-l border-mint-50/50 pt-6 lg:pt-2 lg:pl-8">
                          <div className="text-left lg:text-right">
                            <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-widest block mb-1">
                              Refund Amount
                            </span>
                            <PriceTag
                              price={ticket.money}
                              className="text-[26px] font-bold text-mint-1200 tracking-tight"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                : paginatedInvoices.map((inv) => {
                    const firstItem = inv.productList?.[0]
                    const firstProduct = firstItem?.product?.detail || firstItem?.lens?.detail
                    const itemCount = inv.productList?.length || (inv as any).orders?.length || 1

                    return (
                      <OrderCard
                        key={inv._id}
                        id={inv.invoiceCode.replace('HD_', '')}
                        realId={inv._id}
                        name={firstProduct?.name || 'Optical Order'}
                        date={new Date(inv.createdAt).toLocaleDateString()}
                        itemCount={itemCount}
                        price={inv.totalPrice + inv.feeShip - inv.totalDiscount}
                        status={inv.status as InvoiceStatus}
                        canCancel={canCancelInvoice(inv.status as InvoiceStatus)}
                        isCancelling={cancellingInvoiceId === inv._id}
                        onCancel={handleCancelInvoice}
                        image={
                          firstProduct?.imgs?.[0] ||
                          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200'
                        }
                      />
                    )
                  })}
            </div>

            {totalPagesLocal > 1 && (
              <div className="mt-12">
                <OperationPagination
                  page={currentPage}
                  totalPages={totalPagesLocal}
                  total={
                    activeView === 'returns' ? returnPagination.total : filteredInvoices.length
                  }
                  limit={activeView === 'returns' ? 10 : 3}
                  onPageChange={handlePageChange}
                  itemsOnPage={
                    activeView === 'returns' ? returnTickets.length : paginatedInvoices.length
                  }
                />
              </div>
            )}
          </>
        ) : (
          <Card className="p-20 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-mint-50/20 rounded-[32px]">
            <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mb-4 text-mint-400"></div>
            <p className="text-gray-500 font-bold">No orders found in this category.</p>
          </Card>
        )}
      </div>

      {/* Support Footer */}
      <div className="mt-12 p-8 border border-dashed border-mint-200 rounded-3xl flex justify-between items-center bg-white/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
            ?
          </div>
          <div>
            <h4 className="font-bold text-mint-1200">Issues with your delivery?</h4>
            <p className="text-sm text-gray-500">
              Our support team is available 24/7 to assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
