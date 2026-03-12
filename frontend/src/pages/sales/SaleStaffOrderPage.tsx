import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { IoFlashOutline, IoCubeOutline, IoReceiptOutline, IoRepeatOutline } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'
import { salesService } from '@/features/sales/services/salesService'

import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { OrderMetrics } from '@/features/sales/components/orders/OrderMetrics'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { OrderTable } from '@/features/sales/components/orders/OrderTable'
import { StatusFilterBar } from '@/features/sales/components/orders/StatusFilterBar'
import { RealtimeStatusBar } from '@/features/sales/components/orders/RealtimeStatusBar'
import { LockBlockedModal } from '@/features/sales/components/orders/InvoiceLockBadge'
import { PageHeader, RejectionModal } from '@/features/sales/components/common'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { useSalesStaffInvoices } from '@/features/sales/hooks/useSalesStaffInvoices'
import { useInvoiceLock } from '@/features/sales/hooks/useInvoiceLock'
import { useSalesStaffRealtime } from '@/features/sales/hooks/useSalesStaffRealtime'
import { type Invoice } from '@/features/sales/types'
import { ConfirmationModal } from '@/shared/components/ui-core'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useAuthStore } from '@/store/auth.store'

export default function SaleStaffOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const searchQuery = searchParams.get('search') ?? ''

  // ── Auth: lấy staffId để truyền vào lock ────────────────────────────────
  const currentUser = useAuthStore((s) => s.user)
  const staffId = (currentUser as any)?._id || (currentUser as any)?.id || undefined

  // ── Invoice locking ──────────────────────────────────────────────────────
  const { acquireLock, releaseLock, isLockedByOther, lockedCount } = useInvoiceLock(staffId)
  const [showLockBlockedModal, setShowLockBlockedModal] = useState(false)
  const [lockedInvoiceId, setLockedInvoiceId] = useState<string | null>(null)

  // ── Real-time polling ────────────────────────────────────────────────────
  const { isRefreshing, refresh, getLastUpdatedLabel } = useSalesStaffRealtime()

  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [invoiceToProcess, setInvoiceToProcess] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const limit = 8

  const setSearchQuery = (query: string) => {
    const next = new URLSearchParams(searchParams)
    if (query) next.set('search', query)
    else next.delete('search')
    setSearchParams(next)
  }

  // Reset page to 1 whenever filters change to avoid "empty page" issues
  useEffect(() => {
    setPage(1)
  }, [statusFilter, orderTypeFilter, searchQuery])

  const {
    invoices: invoiceList,
    pagination,
    loading: isLoading,
    fetchInvoices: refetch
  } = useSalesStaffInvoices(page, limit, statusFilter, searchQuery)

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList

    // 1. Pending tab: only show invoices with manufacturing/prescription orders
    if (statusFilter === InvoiceStatus.DEPOSITED) {
      list = list.filter((inv: Invoice) => inv.orders?.some((o) => o.isPrescription))
    }

    // 3. Approved/Refunded tabs: No client filter needed as server handles it.
    // We only keep the Pending (DEPOSITED) specific prescription filter if server can't do it.
    if (statusFilter === InvoiceStatus.DEPOSITED) {
      list = list.filter((inv: Invoice) => inv.orders?.some((o) => o.isPrescription))
    }

    // 4. Search filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv: Invoice) =>
          inv.fullName.toLowerCase().includes(q) ||
          inv.invoiceCode.toLowerCase().includes(q) ||
          inv.phone.includes(q)
      )
    }

    // 5. Order type filter
    if (orderTypeFilter !== 'All') {
      list = list.filter((inv: Invoice) =>
        inv.orders?.some((order) => {
          const types = Array.isArray(order.type) ? order.type : [order.type]
          return types.some((t: OrderType | string) => String(t).includes(orderTypeFilter))
        })
      )
    }

    // 6. Sort by newest first
    list = list.sort((a: Invoice, b: Invoice) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return list
  }, [invoiceList, searchQuery, orderTypeFilter, statusFilter])

  // Total pages sanity check: if list is empty on page 1, force total to 1
  const serverTotal = pagination?.total || 0
  const adjustedTotalPages =
    filteredInvoices.length === 0 && page === 1 ? 1 : pagination?.totalPages || 1

  const paginatedInvoices = filteredInvoices

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

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams())
    setPage(1)
  }

  const { data: statusCounts } = useQuery({
    queryKey: ['sales', 'status-counts'],
    queryFn: async () => {
      const tabs = [InvoiceStatus.DEPOSITED, 'APPROVED_OR_REJECTED', InvoiceStatus.REFUNDED]
      const counts: Record<string, number> = {}
      await Promise.all(
        tabs.map(async (tab) => {
          let apiStatus: string | undefined = undefined
          let apiStatuses: string | undefined = undefined

          if (tab === 'APPROVED_OR_REJECTED') {
            apiStatuses = [
              InvoiceStatus.APPROVED,
              InvoiceStatus.ONBOARD,
              InvoiceStatus.READY_TO_SHIP,
              InvoiceStatus.DELIVERING,
              InvoiceStatus.DELIVERED,
              InvoiceStatus.COMPLETED,
              InvoiceStatus.REJECTED,
              InvoiceStatus.CANCELED
            ].join(',')
          } else if (tab === InvoiceStatus.REFUNDED) {
            // If backend doesn't support REFUNDED yet, pass an empty list or specific status
            apiStatus = InvoiceStatus.REFUNDED
          } else {
            apiStatus = tab as string
          }

          const res = await salesService.getDepositedInvoices(1, 1, apiStatus, apiStatuses)
          counts[tab] = res.data.pagination.total
        })
      )
      return counts
    },
    staleTime: 30000
  })

  const statusTabs = useMemo(() => {
    const allTabs = [
      { label: 'All Invoices', value: 'All' },
      { label: 'Pending', value: InvoiceStatus.DEPOSITED },
      { label: 'Approved', value: 'APPROVED_OR_REJECTED' },
      { label: 'Refunded', value: InvoiceStatus.REFUNDED }
    ]
    return allTabs.filter((tab) => {
      if (tab.value === 'All') return true
      return (statusCounts?.[tab.value] ?? 0) > 0
    })
  }, [statusCounts])

  const getStatusBadgeProps = (invoice: Invoice) => {
    const s = invoice.status
    const hasMfg = invoice.orders?.some((o) =>
      (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
        String(t).includes(OrderType.MANUFACTURING)
      )
    )

    if (statusFilter === 'APPROVED_OR_REJECTED') {
      if (s === InvoiceStatus.REJECTED || s === 'REJECTED' || s === InvoiceStatus.CANCELED) {
        return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
      }
      if (
        [
          InvoiceStatus.APPROVED,
          InvoiceStatus.ONBOARD,
          InvoiceStatus.READY_TO_SHIP,
          InvoiceStatus.DELIVERING,
          InvoiceStatus.DELIVERED,
          InvoiceStatus.COMPLETED
        ].includes(s as InvoiceStatus)
      ) {
        return { label: 'Accepted', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
      }
    }

    if (s === InvoiceStatus.DEPOSITED) {
      if (
        invoice.hasManufacturing &&
        invoice.totalOrdersCount &&
        invoice.approvedOrdersCount === invoice.totalOrdersCount
      ) {
        return {
          label: 'Ready to Approve Final',
          color: 'bg-mint-50 text-mint-600 border-mint-200'
        }
      }
      return hasMfg
        ? { label: 'Wait Verify', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
        : { label: 'Pending', color: 'bg-slate-50 text-slate-500 border-slate-200' }
    }

    if (s === InvoiceStatus.APPROVED || s === 'APPROVED')
      return { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    if (s === InvoiceStatus.REJECTED || s === 'REJECTED')
      return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    if (s === InvoiceStatus.REFUNDED || s === 'REFUNDED')
      return { label: 'Refunded', color: 'bg-purple-50 text-purple-600 border-purple-100' }

    return { label: String(s) || 'Unknown', color: 'bg-slate-50 text-slate-400 border-slate-100' }
  }

  const handleApproveClick = (invoiceId: string) => {
    if (isLockedByOther(invoiceId)) {
      setLockedInvoiceId(invoiceId)
      setShowLockBlockedModal(true)
      return
    }
    const locked = acquireLock(invoiceId)
    if (!locked) {
      setLockedInvoiceId(invoiceId)
      setShowLockBlockedModal(true)
      return
    }
    setInvoiceToProcess(invoiceId)
    setShowConfirmModal(true)
  }

  const confirmApproval = async () => {
    if (invoiceToProcess) {
      await approveInvoice(invoiceToProcess)
      releaseLock(invoiceToProcess)
      refetch()
      setShowConfirmModal(false)
      setInvoiceToProcess(null)
    }
  }

  const confirmRejection = async (note: string) => {
    if (invoiceToProcess) {
      await rejectInvoice(invoiceToProcess, note)
      releaseLock(invoiceToProcess)
      refetch()
      setShowRejectModal(false)
      setInvoiceToProcess(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Order Management"
          breadcrumbs={[{ label: 'Dashboard', path: '/sale-staff/dashboard' }, { label: 'Orders' }]}
          subtitle="Consolidated view of all sales orders, pre-orders, and returns."
        />
        <RealtimeStatusBar
          isRefreshing={isRefreshing}
          lastUpdatedLabel={getLastUpdatedLabel()}
          lockedCount={lockedCount}
          onRefresh={refresh}
          className="shrink-0 mt-1"
        />
      </div>
      <div className="space-y-6">
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
          onReset={handleResetFilters}
          orderTypeFilter={orderTypeFilter}
        />
        <div className="bg-white border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 rounded-3xl overflow-hidden">
          <OrderTable
            invoices={paginatedInvoices}
            selectedInvoiceId={selectedInvoiceId}
            setSelectedInvoiceId={setSelectedInvoiceId}
            getStatusBadgeProps={getStatusBadgeProps}
            handleApproveClick={handleApproveClick}
            processing={processing}
            isLockedByOther={isLockedByOther}
          />
          {(serverTotal > 0 || filteredInvoices.length > 0) && (
            <OrderPagination
              page={page}
              totalPages={adjustedTotalPages}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <InvoiceOrdersDrawer
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          // Release lock khi user hủy thao tác approve
          if (invoiceToProcess) releaseLock(invoiceToProcess)
          setShowConfirmModal(false)
          setInvoiceToProcess(null)
        }}
        onConfirm={confirmApproval}
        title="Approve Invoice"
        message={
          <div className="space-y-2">
            <p className="text-slate-600">Are you sure you want to approve this invoice?</p>
            <p className="text-slate-500 text-sm">
              All orders within this invoice will be marked as{' '}
              <span className="text-mint-600 font-semibold uppercase">verified</span> and proceed to
              the next stage.
            </p>
          </div>
        }
        details={
          invoiceToProcess && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Items to Approve
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-mint-600 uppercase">
                    {invoiceList.find((inv) => inv.id === invoiceToProcess)?.orders?.length || 0}{' '}
                    Total
                  </span>
                </div>
              </div>

              <div className="max-h-[240px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {invoiceList
                  .find((inv) => inv.id === invoiceToProcess)
                  ?.orders?.map((order, i) => (
                    <div
                      key={order.id || i}
                      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-mint-200 hover:shadow-md hover:shadow-mint-50/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-mint-50 group-hover:text-mint-600 transition-colors">
                          <IoReceiptOutline size={20} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700 font-mono tracking-tight leading-none group-hover:text-mint-600 transition-colors">
                              #{order.orderCode || order.id?.slice(-8)}
                            </span>
                            {order.isPrescription && (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md text-[8px] font-bold uppercase tracking-tight border border-rose-100/50">
                                RX
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(order.type)
                              ? order.type
                              : [order.type || 'REGULAR']
                            ).map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-medium uppercase tracking-wide border border-slate-200/50"
                              >
                                {String(t).replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border shadow-sm transition-all ${
                            [
                              'VERIFIED',
                              'APPROVE',
                              'APPROVED',
                              'WAITING_ASSIGN',
                              'ASSIGNED',
                              'MAKING',
                              'PACKAGING',
                              'COMPLETED',
                              'ONBOARD'
                            ].includes(String(order.status).toUpperCase())
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'
                              : 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'
                          }`}
                        >
                          {String(order.status).replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-3 bg-mint-50/40 rounded-2xl border border-mint-100/40">
                <p className="text-[11px] font-medium text-mint-700 leading-relaxed text-center">
                  Once approved, all listed items will be marked as{' '}
                  <span className="font-bold text-mint-900">VERIFIED</span> and shifted to the{' '}
                  <span className="font-bold text-mint-900">PACKAGING</span> stage.
                </p>
              </div>
            </div>
          )
        }
        confirmText="Approve Invoice"
        type="info"
        isLoading={processing}
      />
      <RejectionModal
        isOpen={showRejectModal}
        onClose={() => {
          // Release lock khi close rejection modal mà không confirm
          if (invoiceToProcess) releaseLock(invoiceToProcess)
          setShowRejectModal(false)
          setInvoiceToProcess(null)
        }}
        onConfirm={confirmRejection}
        isLoading={processing}
      />

      {/* Lock blocked notification - hiện khi user cố xử lý invoice đang bị lock */}
      <LockBlockedModal
        isOpen={showLockBlockedModal}
        invoiceId={lockedInvoiceId}
        onClose={() => {
          setShowLockBlockedModal(false)
          setLockedInvoiceId(null)
        }}
      />
    </div>
  )
}
