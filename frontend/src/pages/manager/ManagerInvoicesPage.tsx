import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoFlashOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoRepeatOutline
} from 'react-icons/io5'

import { Container, Button } from '@/shared/components/ui-core'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { PageHeader } from '@/features/sales/components/common'

import { useAdminInvoices, useComplete, useOnboard } from '@/features/manager/hooks'
import { useOrderTypeStats } from '@/features/sales/hooks'

import ManagerOrderDrawer from './components/invoices/ManagerOrderDrawer'
import { ManagerMetricCard } from './components/invoices/ManagerMetricCard'
import { ManagerInvoiceTable } from './components/invoices/ManagerInvoiceTable'
import { ManagerInvoiceFilters } from './components/invoices/ManagerInvoiceFilters'

export default function ManagerInvoicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const searchQuery = searchParams.get('search') ?? ''
  const [page, setPage] = useState(1)

  const setSearchQuery = (query: string) => {
    const next = new URLSearchParams(searchParams)
    if (query) next.set('search', query)
    else next.delete('search')
    setSearchParams(next)
  }

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const limit = 8
  const { onboard, isLoading: isOnboarding } = useOnboard()
  const { complete, isLoading: isCompleting } = useComplete()

  const apiStatus = statusFilter === 'All' ? undefined : statusFilter

  // NEW: Use stats API for counts (Same as Sale Staff)
  const { stats: orderStats, refetch: refetchStats } = useOrderTypeStats()

  // Table data: Optimized to fetch only 8 items with Server-side pagination
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchInvoices
  } = useAdminInvoices(page, limit, apiStatus, searchQuery.trim() || undefined)

  const invoiceList = useMemo(() => data?.data.invoiceList ?? [], [data])
  const pagination = data?.data.pagination
  const totalPages = pagination?.totalPages ?? 1

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList
    if (orderTypeFilter !== 'All') {
      list = list.filter((inv) =>
        inv.orders?.some((o) =>
          (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
            String(t).includes(orderTypeFilter)
          )
        )
      )
    }
    return list
  }, [invoiceList, orderTypeFilter])

  const metrics = useMemo(() => {
    const totalCount = orderStats?.total || 1

    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: orderStats?.totalNormal || 0,
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint' as const,
        trend: {
          label: 'of total',
          value: orderStats?.totalNormal
            ? Math.round((orderStats.totalNormal / totalCount) * 100)
            : 0,
          isPositive: true
        }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: orderStats?.totalManu || 0,
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary' as const,
        trend: {
          label: 'of total',
          value: orderStats?.totalManu ? Math.round((orderStats.totalManu / totalCount) * 100) : 0,
          isPositive: true
        }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: 0, // No data for returns in this API yet
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger' as const,
        trend: {
          label: 'of total',
          value: 0,
          isPositive: false
        }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: orderStats?.totalPreOrder || 0,
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info' as const,
        trend: {
          label: 'of total',
          value: orderStats?.totalPreOrder
            ? Math.round((orderStats.totalPreOrder / totalCount) * 100)
            : 0,
          isPositive: true
        }
      }
    ]
  }, [orderStats])

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
      <ManagerInvoiceFilters
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        orderTypeFilter={orderTypeFilter}
        onOrderTypeChange={handleOrderTypeChange}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        onReset={() => {
          setSearchParams(new URLSearchParams())
          setPage(1)
          refetchInvoices()
        }}
        isLoading={isLoading}
      />
      <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm overflow-hidden">
        <ManagerInvoiceTable
          invoices={filteredInvoices}
          isLoading={isLoading}
          errorMessage={isError ? (error as Error)?.message || 'Error loading invoices' : null}
          selectedInvoiceId={selectedInvoiceId}
          onSelectInvoice={setSelectedInvoiceId}
        />
        <div className="p-6 bg-white border-t border-neutral-50/50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200"
              disabled={page >= totalPages || isLoading}
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
        isOnboarding={isOnboarding || isCompleting}
        onOnboard={async (id) => {
          await onboard(id)
          await Promise.all([refetchInvoices(), refetchStats()])
        }}
        onComplete={async (id) => {
          await complete(id)
          await Promise.all([refetchInvoices(), refetchStats()])
        }}
        onRefetch={async () => {
          await Promise.all([refetchInvoices(), refetchStats()])
        }}
      />
    </Container>
  )
}
