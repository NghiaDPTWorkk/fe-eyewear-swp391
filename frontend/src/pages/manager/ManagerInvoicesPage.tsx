import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, MetricCard, Button } from '@/components'
import { useAdminInvoices } from '@/features/manager/hooks/useAdminInvoices'
import { useComplete } from '@/features/manager/hooks/useComplete'
import { useDelivering } from '@/features/manager/hooks/useDelivering'
import { useOnboard } from '@/features/manager/hooks/useOnboard'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { PageHeader } from '@/features/sales/components/common'
import ManagerOrderDrawer from './components/invoices/ManagerOrderDrawer'
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonCircleOutline,
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

  const invoiceList = data?.data.invoiceList ?? []
  const pagination = data?.data.pagination

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList

    if (orderTypeFilter !== 'All') {
      list = list.filter((inv) => inv.orders?.some((o) => o.type?.includes(orderTypeFilter)))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv) =>
          inv.fullName.toLowerCase().includes(q) ||
          inv.invoiceCode.toLowerCase().includes(q) ||
          inv.phone.includes(q)
      )
    }

    return list
  }, [invoiceList, orderTypeFilter, searchQuery])

  const metrics = useMemo(() => {
    const counts = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }

    invoiceList.forEach((inv) => {
      inv.orders?.forEach((o) => {
        if (o.type?.includes(OrderType.NORMAL)) counts[OrderType.NORMAL]++
        if (o.type?.includes(OrderType.MANUFACTURING)) counts[OrderType.MANUFACTURING]++
        if (o.type?.includes(OrderType.RETURN)) counts[OrderType.RETURN]++
        if (o.type?.includes(OrderType.PRE_ORDER)) counts[OrderType.PRE_ORDER]++
      })
    })

    const totalOrders = Object.values(counts).reduce((a, b) => a + b, 0) || 1

    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint' as const,
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.NORMAL] / totalOrders) * 100),
          isPositive: true
        }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary' as const,
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.MANUFACTURING] / totalOrders) * 100),
          isPositive: true
        }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger' as const,
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.RETURN] / totalOrders) * 100),
          isPositive: false
        }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info' as const,
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.PRE_ORDER] / totalOrders) * 100),
          isPositive: true
        }
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

  const statusTabs = [
    { label: 'All Invoices', value: 'All' },
    { label: 'Pending', value: InvoiceStatus.PENDING },
    { label: 'Deposited', value: InvoiceStatus.DEPOSITED },
    { label: 'Approved', value: InvoiceStatus.APPROVED },
    { label: 'Onboard', value: InvoiceStatus.ONBOARD },
    { label: 'Delivering', value: InvoiceStatus.DELIVERING },
    { label: 'Completed', value: InvoiceStatus.COMPLETED }
  ]

  const orderTypeOptions = [
    { label: 'All Orders', value: 'All' },
    { label: 'Normal', value: OrderType.NORMAL },
    { label: 'Manufacturing', value: OrderType.MANUFACTURING },
    { label: 'Pre-Order', value: OrderType.PRE_ORDER },
    { label: 'Return', value: OrderType.RETURN }
  ]

  const errorMessage = isError
    ? (error as any)?.message || 'Không lấy được danh sách invoice'
    : null

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Order Management"
        subtitle="Manage customer invoices and manufacturing tasks."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Orders' }]}
      />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="cursor-pointer transition-transform active:scale-95"
            onClick={() => handleOrderTypeChange(m.type)}
          >
            <MetricCard
              label={m.label}
              value={m.value}
              icon={m.icon}
              colorScheme={m.colorScheme}
              trend={m.trend}
              className={orderTypeFilter === m.type ? 'ring-2 ring-mint-500 ring-offset-2' : ''}
            />
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="px-4 mb-6 overflow-x-auto">
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 rounded-2xl w-fit border border-neutral-100">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-white text-mint-600 shadow-sm border border-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden mx-4">
        <div className="p-6 border-b border-neutral-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all font-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all min-w-[160px] justify-between h-[42px] ${
                  isFilterOpen
                    ? 'border-mint-500 bg-mint-50 text-mint-600 ring-4 ring-mint-500/10'
                    : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IoFilterOutline
                    className={isFilterOpen ? 'text-mint-600' : 'text-neutral-400'}
                  />
                  <span>
                    {orderTypeOptions.find((o) => o.value === orderTypeFilter)?.label ||
                      'All Types'}
                  </span>
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
                      {orderTypeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                            orderTypeFilter === opt.value
                              ? 'bg-mint-50 text-mint-600 font-bold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:pl-4'
                          }`}
                          onClick={() => handleOrderTypeChange(opt.value)}
                        >
                          {opt.label}
                          {orderTypeFilter === opt.value && (
                            <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                          )}
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50/50 text-[11px] text-neutral-400 font-semibold tracking-widest uppercase border-b border-neutral-50">
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
                  <td
                    colSpan={5}
                    className="py-20 text-center text-red-500 font-medium font-primary"
                  >
                    {errorMessage}
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-neutral-400 font-medium font-primary"
                  >
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`group hover:bg-neutral-50 transition-colors cursor-pointer ${selectedInvoiceId === inv.id ? 'bg-mint-50/40' : ''}`}
                    onClick={() => setSelectedInvoiceId(inv.id)}
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
                        onClick={() => setSelectedInvoiceId(inv.id)}
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

        {/* Pagination Section */}
        <div className="p-6 bg-neutral-50/50 border-t border-neutral-50 flex items-center justify-between font-primary">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
            {pagination ? `Page ${pagination.page} of ${pagination.totalPages}` : `Page ${page}`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200 bg-white"
              disabled={page === 1 || isLoading}
              onClick={(e) => {
                e.stopPropagation()
                setPage((p) => Math.max(1, p - 1))
              }}
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200 bg-white"
              disabled={!pagination || page >= pagination.totalPages || isLoading}
              onClick={(e) => {
                e.stopPropagation()
                setPage((p) => p + 1)
              }}
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      </div>

      {/* Drawer Details Section */}
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
