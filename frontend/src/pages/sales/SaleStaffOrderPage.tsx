import { useMemo, useState } from 'react'
import { IoFlashOutline, IoCubeOutline, IoReceiptOutline, IoRepeatOutline } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { OrderMetrics } from '@/features/sales/components/orders/OrderMetrics'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { OrderTable } from '@/features/sales/components/orders/OrderTable'
import { StatusFilterBar } from '@/features/sales/components/orders/StatusFilterBar'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import { type Invoice } from '@/features/sales/types'
import { PageHeader } from '@/features/staff'
import { Container, ConfirmationModal } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'

export default function SaleStaffOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const { approveInvoice, processing } = useSalesStaffAction()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [invoiceToApprove, setInvoiceToApprove] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const limit = 10

  const {
    invoices: invoiceList,
    pagination,
    loading: isLoading,
    fetchInvoices: refetch
  } = useSalesStaffInvoices(page, limit, statusFilter)

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv: Invoice) =>
          inv.fullName.toLowerCase().includes(q) ||
          inv.invoiceCode.toLowerCase().includes(q) ||
          inv.phone.includes(q)
      )
    }
    if (orderTypeFilter !== 'All') {
      list = list.filter((inv: Invoice) =>
        inv.orders?.some((order) => {
          const types = Array.isArray(order.type) ? order.type : [order.type]
          return types.some((t: OrderType | string) => String(t).includes(orderTypeFilter))
        })
      )
    }
    return list
  }, [invoiceList, searchQuery, orderTypeFilter])

  const totalPages = pagination?.totalPages || 1

  const metrics = useMemo(() => {
    const counts: Record<string, number> = {
      [OrderType.NORMAL]: 0,
      [OrderType.MANUFACTURING]: 0,
      [OrderType.RETURN]: 0,
      [OrderType.PRE_ORDER]: 0
    }
    invoiceList.forEach((inv: Invoice) => {
      if (inv.orders && inv.orders.length > 0) {
        inv.orders.forEach((o) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.NORMAL)))
            counts[OrderType.NORMAL]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.MANUFACTURING)))
            counts[OrderType.MANUFACTURING]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.RETURN)))
            counts[OrderType.RETURN]++
          if (types.some((t: OrderType | string) => String(t).includes(OrderType.PRE_ORDER)))
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
    { label: 'Pending', value: InvoiceStatus.DEPOSITED },
    { label: 'Approved', value: 'APPROVED_OR_REJECTED' },
    { label: 'Refunded', value: InvoiceStatus.REFUNDED }
  ]

  const getStatusBadgeProps = (invoice: Invoice) => {
    const s = invoice.status
    const hasMfg = invoice.orders?.some((o) => o.type?.includes(OrderType.MANUFACTURING))
    if (s === InvoiceStatus.DEPOSITED) {
      return hasMfg
        ? { label: 'Wait Verify', color: 'bg-blue-50 text-blue-600 border-blue-100' }
        : { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-100' }
    }
    if (s === InvoiceStatus.APPROVED)
      return { label: 'Approved', color: 'bg-mint-50 text-mint-600 border-mint-100' }
    if (s === InvoiceStatus.REJECTED)
      return { label: 'Rejected', color: 'bg-red-50 text-red-600 border-red-100' }
    if (s === InvoiceStatus.REFUNDED)
      return { label: 'Refunded', color: 'bg-purple-50 text-purple-600 border-purple-100' }
    return { label: String(s) || 'Unknown', color: 'bg-slate-50 text-slate-400 border-slate-100' }
  }

  const handleApproveClick = (invoiceId: string) => {
    setInvoiceToApprove(invoiceId)
    setShowConfirmModal(true)
  }

  const confirmApproval = async () => {
    if (invoiceToApprove) {
      await approveInvoice(invoiceToApprove)
      refetch()
      setShowConfirmModal(false)
      setInvoiceToApprove(null)
    }
  }

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Order Management"
        subtitle="Consolidated view of all sales orders, pre-orders, and returns."
        breadcrumbs={[{ label: 'Dashboard', path: '/salestaff/dashboard' }, { label: 'Orders' }]}
      />
      <OrderMetrics
        metrics={metrics}
        orderTypeFilter={orderTypeFilter}
        onOrderTypeChange={handleOrderTypeChange}
      />
      <StatusFilterBar
        statusTabs={statusTabs}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
      />
      <div className="mx-4 bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-xl shadow-neutral-100/50">
        <OrderTable
          invoices={filteredInvoices}
          selectedInvoiceId={selectedInvoiceId}
          setSelectedInvoiceId={setSelectedInvoiceId}
          getStatusBadgeProps={getStatusBadgeProps}
          handleApproveClick={handleApproveClick}
          processing={processing}
        />
        <OrderPagination
          filteredCount={filteredInvoices.length}
          total={pagination?.total || 0}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>
      <InvoiceOrdersDrawer
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmApproval}
        title="Approve Invoice"
        message="Are you sure you want to approve this invoice? All orders within this invoice will be marked as verified and proceed to the next stage."
        confirmText="Approve Invoice"
        type="info"
        isLoading={processing}
      />
    </Container>
  )
}
