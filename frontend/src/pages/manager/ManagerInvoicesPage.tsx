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
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const limit = 10

  const { onboard, isLoading: isOnboarding } = useOnboard()
  const { complete, isLoading: isCompleting } = useComplete()

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
        inv.orders?.some((o) =>
          (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
            String(t).includes(orderTypeFilter)
          )
        )
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
      if (inv.orders?.length)
        inv.orders.forEach((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          Object.values(OrderType).forEach((type) => {
            if (types.some((t) => String(t).includes(type))) counts[type]++
          })
        })
      else counts[OrderType.NORMAL]++
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    return [
      {
        type: OrderType.NORMAL,
        label: 'Regular Orders',
        value: counts[OrderType.NORMAL],
        icon: <IoReceiptOutline className="text-2xl" />,
        colorScheme: 'mint',
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.NORMAL] / total) * 100),
          isPositive: true
        }
      },
      {
        type: OrderType.MANUFACTURING,
        label: 'Consultations',
        value: counts[OrderType.MANUFACTURING],
        icon: <IoFlashOutline className="text-2xl" />,
        colorScheme: 'secondary',
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.MANUFACTURING] / total) * 100),
          isPositive: true
        }
      },
      {
        type: OrderType.RETURN,
        label: 'Returns',
        value: counts[OrderType.RETURN],
        icon: <IoRepeatOutline className="text-2xl" />,
        colorScheme: 'danger',
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.RETURN] / total) * 100),
          isPositive: false
        }
      },
      {
        type: OrderType.PRE_ORDER,
        label: 'Pre-Orders',
        value: counts[OrderType.PRE_ORDER],
        icon: <IoCubeOutline className="text-2xl" />,
        colorScheme: 'info',
        trend: {
          label: 'of total',
          value: Math.round((counts[OrderType.PRE_ORDER] / total) * 100),
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
        onRefetch={refetch}
        isLoading={isLoading}
      />
      <div className="bg-white rounded-3xl border border-neutral-50/50 shadow-sm overflow-hidden">
        <ManagerInvoiceTable
          invoices={filteredInvoices}
          isLoading={isLoading}
          errorMessage={isError ? (error as Error)?.message || 'Lỗi' : null}
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
        isOnboarding={isOnboarding || isCompleting}
        onOnboard={async (id) => {
          await onboard(id)
          refetch()
        }}
        onComplete={async (id) => {
          await complete(id)
          refetch()
        }}
        onRefetch={refetch}
      />
    </Container>
  )
}
