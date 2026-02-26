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

const ManagerMetricCard: React.FC<{
  label: string
  value: number
  icon: React.ReactNode
  colorScheme: string
  trend: { label: string; value: number; isPositive: boolean }
  isActive: boolean
  onClick: () => void
}> = ({ label, value, icon, colorScheme, trend, isActive, onClick }) => {
  const getIconBg = () => {
    switch (colorScheme) {
      case 'mint':
        return 'bg-mint-50 text-mint-700'
      case 'secondary':
        return 'bg-purple-50 text-purple-600'
      case 'danger':
        return 'bg-red-50 text-red-600'
      case 'info':
        return 'bg-sky-50 text-sky-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border-none shadow-sm ring-1 ring-neutral-100/50 transition-all cursor-pointer active:scale-95 ${
        isActive
          ? 'ring-2 ring-mint-500 ring-offset-4 shadow-2xl shadow-mint-100/50 scale-[1.02]'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] font-bold text-slate-400 tracking-wider whitespace-nowrap uppercase">
            {label}
          </p>
          <h3 className="text-2xl font-bold mt-1.5 text-slate-900 tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div
            className={`p-3.5 rounded-2xl shadow-sm transition-transform hover:scale-105 ${getIconBg()}`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={`font-bold flex items-center ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
        </span>
        <span className="text-gray-500">{trend.label}</span>
      </div>
    </div>
  )
}

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
          if (types.some((t: string) => String(t).includes(OrderType.NORMAL)))
            counts[OrderType.NORMAL]++
          if (types.some((t: string) => String(t).includes(OrderType.MANUFACTURING)))
            counts[OrderType.MANUFACTURING]++
          if (types.some((t: string) => String(t).includes(OrderType.RETURN)))
            counts[OrderType.RETURN]++
          if (types.some((t: string) => String(t).includes(OrderType.PRE_ORDER)))
            counts[OrderType.PRE_ORDER]++
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
        colorScheme: 'mint' as const,
        trend: { label: 'of total', value: pct(OrderType.NORMAL), isPositive: true }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary' as const,
        trend: { label: 'of total', value: pct(OrderType.MANUFACTURING), isPositive: true }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger' as const,
        trend: { label: 'of total', value: pct(OrderType.RETURN), isPositive: false }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info' as const,
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
    ? (error as { message?: string })?.message || 'Không lấy được danh sách invoice'
    : null

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Order Management"
        subtitle="Manage customer invoices and manufacturing tasks."
        breadcrumbs={[{ label: 'Dashboard', path: '/manager/dashboard' }, { label: 'Orders' }]}
      />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <ManagerMetricCard
            key={i}
            label={m.label}
            value={m.value}
            icon={m.icon}
            colorScheme={m.colorScheme}
            trend={m.trend}
            isActive={orderTypeFilter === m.type}
            onClick={() => handleOrderTypeChange(m.type)}
          />
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="overflow-x-auto">
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
        <div className="p-6 bg-white border-t border-neutral-50/50 flex items-center justify-between font-primary">
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
