import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Button } from '@/shared/components/ui-core'
import { useAdminInvoices } from '@/features/manager/hooks/useAdminInvoices'
import { useComplete } from '@/features/manager/hooks/useComplete'
import { useDelivering } from '@/features/manager/hooks/useDelivering'
import { useOnboard } from '@/features/manager/hooks/useOnboard'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { PageHeader } from '@/features/sales/components/common'
import ManagerOrderDrawer from './components/invoices/ManagerOrderDrawer'
import { ManagerMetricCard } from './components/invoices/ManagerMetricCard'
import { ManagerInvoiceTable } from './components/invoices/ManagerInvoiceTable'
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoFlashOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoRepeatOutline,
  IoSearchOutline
} from 'react-icons/io5'

export default function ManagerInvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const [searchQuery, setSearchQuery] = useState('')

  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const limit = 10

  const { onboard, isLoading: isOnboarding } = useOnboard()
  const { complete, isLoading: isCompleting } = useComplete()
  const { delivering, isLoading: isDelivering } = useDelivering()

  const apiStatus = statusFilter === 'All' ? undefined : statusFilter
  const { data, isLoading, isError, error, refetch } = useAdminInvoices(page, limit, apiStatus)

  const invoiceList = useMemo(() => data?.data.invoiceList ?? [], [data])
  const pagination = data?.data.pagination

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList
    if (orderTypeFilter !== 'All') {
      list = list.filter((inv) =>
        inv.orders?.some((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          return types.some((t: string) => String(t).includes(orderTypeFilter))
        })
      )
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv) =>
          inv.fullName?.toLowerCase().includes(q) ||
          inv.invoiceCode?.toLowerCase().includes(q) ||
          inv.phone?.includes(q)
      )
    }
    return list
  }, [invoiceList, orderTypeFilter, searchQuery])

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }
    invoiceList.forEach((inv) => {
      if (inv.orders && inv.orders.length > 0) {
        inv.orders.forEach((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          Object.values(OrderType).forEach((type) => {
            if (types.some((t: string) => String(t).includes(type))) counts[type]++
          })
        })
      } else {
        counts[OrderType.NORMAL]++
      }
    })
    const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const pct = (key: string) => Math.round((counts[key] / totalOrders) * 100)

    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint',
        trend: { label: 'of total', value: pct(OrderType.NORMAL), isPositive: true }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary',
        trend: { label: 'of total', value: pct(OrderType.MANUFACTURING), isPositive: true }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger',
        trend: { label: 'of total', value: pct(OrderType.RETURN), isPositive: false }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info',
        trend: { label: 'of total', value: pct(OrderType.PRE_ORDER), isPositive: true }
      }
    ]
  }, [invoiceList])

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleStatusChange = (status: string) => {
    setSearchParams((prev) => {
      if (status === 'All') prev.delete('status')
      else prev.set('status', status)
      return prev
    })
    setPage(1)
  }

  const handleOrderTypeChange = (type: string) => {
    setSearchParams((prev) => {
      if (type === 'All') prev.delete('orderType')
      else prev.set('orderType', type)
      return prev
    })
    setPage(1)
    setIsFilterOpen(false)
  }

  const errorMessage = isError
    ? (error as { message?: string })?.message || 'Không lấy được danh sách invoice'
    : null

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Order Management"
        subtitle="Manage customer invoices and manufacturing tasks."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Orders' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <ManagerMetricCard
            key={i}
            {...m}
            isActive={orderTypeFilter === m.type}
            onClick={() => handleOrderTypeChange(m.type)}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {[
            'All',
            InvoiceStatus.PENDING,
            InvoiceStatus.DEPOSITED,
            InvoiceStatus.APPROVED,
            InvoiceStatus.ONBOARD,
            InvoiceStatus.DELIVERING,
            InvoiceStatus.COMPLETED
          ].map((val) => (
            <button
              key={val}
              onClick={() => handleStatusChange(val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === val ? 'bg-white text-mint-600 shadow-sm border border-neutral-100' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              {val === 'All' ? 'All Invoices' : val}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 max-w-md relative">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, code or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px] ${isFilterOpen ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10' : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
              >
                <div className="flex items-center gap-2">
                  <IoFilterOutline
                    className={isFilterOpen ? 'text-mint-600' : 'text-neutral-400'}
                  />
                  <span>{orderTypeFilter === 'All' ? 'All Types' : orderTypeFilter}</span>
                </div>
                <IoChevronBackOutline
                  className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-90' : '-rotate-90'}`}
                  size={12}
                />
              </button>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 w-56 z-20 p-2 bg-white rounded-2xl shadow-xl shadow-mint-900/5 border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      {[
                        'All',
                        OrderType.NORMAL,
                        OrderType.MANUFACTURING,
                        OrderType.PRE_ORDER,
                        OrderType.RETURN
                      ].map((val) => (
                        <button
                          key={val}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${orderTypeFilter === val ? 'bg-mint-50 text-mint-600 font-bold' : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'}`}
                          onClick={() => handleOrderTypeChange(val)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-neutral-200 h-[42px] w-[42px] bg-white"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <IoRefreshOutline className={isLoading ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        <ManagerInvoiceTable
          invoices={filteredInvoices as any[]}
          isLoading={isLoading}
          errorMessage={errorMessage}
          selectedInvoiceId={selectedInvoiceId}
          onSelectInvoice={setSelectedInvoiceId}
        />

        <div className="p-6 bg-white border-t border-neutral-50/50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
            {pagination ? `Page ${pagination.page} of ${pagination.totalPages}` : `Page ${page}`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200 bg-white"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200 bg-white"
              disabled={!pagination || page >= pagination.totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      </div>

      <ManagerOrderDrawer
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
        isOnboarding={isOnboarding || isCompleting || isDelivering}
        onOnboard={async (id) => {
          await onboard(id)
          refetch()
        }}
        onComplete={async (id) => {
          await complete(id)
          refetch()
        }}
        onDelivering={async (id) => {
          await delivering(id)
          refetch()
        }}
      />
    </Container>
  )
}
