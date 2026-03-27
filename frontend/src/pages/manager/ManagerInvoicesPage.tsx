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

  // Global metrics data (unfiltered)
  const { data: metricsData } = useAdminInvoices(1, 100, undefined, undefined)
  const metricsInvoices = useMemo(() => metricsData?.data.invoiceList ?? [], [metricsData])

  // Table data (filtered by status/search but large limit for client-side sub-filtering)
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchInvoices
  } = useAdminInvoices(1, 100, apiStatus, searchQuery.trim() || undefined)

  const invoiceList = useMemo(() => data?.data.invoiceList ?? [], [data])
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
    // Search is now handled server-side via useAdminInvoices
    return list
  }, [invoiceList, orderTypeFilter])

  const total = filteredInvoices.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(page, totalPages)

  const paginatedInvoices = useMemo(() => {
    const start = (safePage - 1) * limit
    return filteredInvoices.slice(start, start + limit)
  }, [filteredInvoices, safePage, limit])

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }

    const typeEntries = Object.values(OrderType)

    for (const inv of metricsInvoices) {
      if (!inv.orders || inv.orders.length === 0) {
        counts[OrderType.NORMAL]++
        continue
      }

      // Track types already counted for this invoice for the metrics cards
      const invoiceTypes = new Set<string>()
      for (const o of inv.orders) {
        const types = Array.isArray(o.type) ? o.type : [o.type]
        types.forEach((t) => {
          typeEntries.forEach((typeKey) => {
            if (String(t).includes(typeKey)) {
              invoiceTypes.add(typeKey)
            }
          })
        })
      }
      invoiceTypes.forEach((typeKey) => {
        counts[typeKey]++
      })
    }

    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0) || 1

    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint' as const,
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.NORMAL] / totalCount) * 100),
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
          value: Math.round((counts[OrderType.MANUFACTURING] / totalCount) * 100),
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
          value: Math.round((counts[OrderType.RETURN] / totalCount) * 100),
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
          value: Math.round((counts[OrderType.PRE_ORDER] / totalCount) * 100),
          isPositive: true
        }
      }
    ]
  }, [metricsInvoices])

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
        onRefetch={refetchInvoices}
        isLoading={isLoading}
      />
      <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm overflow-hidden">
        <ManagerInvoiceTable
          invoices={paginatedInvoices}
          isLoading={isLoading}
          errorMessage={isError ? (error as Error)?.message || 'Error loading invoices' : null}
          selectedInvoiceId={selectedInvoiceId}
          onSelectInvoice={setSelectedInvoiceId}
        />
        <div className="p-6 bg-white border-t border-neutral-50/50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest pl-2">
            Page {safePage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200"
              disabled={safePage === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-2 border-neutral-200"
              disabled={safePage >= totalPages || isLoading}
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
          refetchInvoices()
        }}
        onComplete={async (id) => {
          await complete(id)
          refetchInvoices()
        }}
        onRefetch={refetchInvoices}
      />
    </Container>
  )
}
