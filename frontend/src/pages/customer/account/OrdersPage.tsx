import { useState, useEffect } from 'react'
import { Card } from '@/shared/components/ui/card'
import { OrderCard } from '@/components/layout/customer/account/orders/OrderCard'
import { cn } from '@/lib/utils'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import type { Invoice } from '@/shared/types/invoice.types'
import { Loader2 } from 'lucide-react'
import { Pagination } from '@/shared/components/ui/pagination'

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'delivering', label: 'Delivering' },
  { id: 'history', label: 'History' }
]

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setCurrentPage(1)
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await invoiceService.getInvoices({
          page: currentPage,
          limit: 3
        })
        if (response.success) {
          // Fetch full details for each invoice to get product list
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
          setTotalPages(response.data.totalPages)
        } else {
          setError(response.message)
        }
      } catch (err: any) {
        setError('Failed to fetch orders. Please try again later.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [currentPage])

  const mapBackendStatus = (status: string): any => {
    switch (status) {
      case 'PENDING':
        return 'PENDING'
      case 'APPROVED':
      case 'DEPOSITED':
        return 'APPROVE'
      case 'WAITING_ASSIGN':
      case 'ONBOARD':
        return 'PROCESSING'
      case 'DELIVERING':
        return 'DELIVERING'
      case 'DELIVERED':
      case 'COMPLETED':
        return 'DELIVERED'
      case 'REJECTED':
        return 'REJECTED'
      case 'CANCEL':
        return 'CANCELED'
      default:
        return 'PENDING'
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const uiStatus = mapBackendStatus(inv.status)
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return uiStatus === 'PENDING' || uiStatus === 'APPROVE'
    if (activeTab === 'processing') return uiStatus === 'PROCESSING'
    if (activeTab === 'delivering') return uiStatus === 'DELIVERING'
    if (activeTab === 'history')
      return uiStatus === 'DELIVERED' || uiStatus === 'REJECTED' || uiStatus === 'CANCELED'
    return true
  })

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
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.1em] bg-white text-primary-600 rounded-lg shadow-sm border border-mint-100/10 transition-all">
            Active
          </button>
          <button className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 hover:text-mint-1200 transition-colors">
            Archived
          </button>
        </div>
      </div>

      {/* Modern Tabs with Cleaner Spacing */}
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
        ) : filteredInvoices.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              {filteredInvoices.map((inv) => {
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
                    price={inv.totalPrice}
                    status={mapBackendStatus(inv.status)}
                    image={
                      firstProduct?.imgs?.[0] ||
                      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=200'
                    }
                  />
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="p-20 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-mint-50/20 rounded-[32px]">
            <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center mb-4 text-mint-400">
              📦
            </div>
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
        <button className="text-primary-600 font-bold text-sm border-b-2 border-primary-200 hover:border-primary-500 transition-all">
          Open Support Ticket
        </button>
      </div>
    </div>
  )
}
