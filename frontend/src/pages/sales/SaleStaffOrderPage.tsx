import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  IoFlashOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoRepeatOutline,
  IoChevronBackOutline,
  IoLockClosedOutline
} from 'react-icons/io5'
import { InvoiceOrdersDrawer } from '@/features/sales/components/dashboard/InvoiceOrdersDrawer'
import { OrderMetrics } from '@/features/sales/components/orders/OrderMetrics'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { OrderTable } from '@/features/sales/components/orders/OrderTable'
import { StatusFilterBar } from '@/features/sales/components/orders/StatusFilterBar'
import { RealtimeStatusBar } from '@/features/sales/components/orders/RealtimeStatusBar'
import { LockBlockedModal } from '@/features/sales/components/orders/InvoiceLockBadge'
import { PageHeader, RejectionModal } from '@/features/sales/components/common'

import {
  useSalesStaffAction,
  useSalesStaffInvoices,
  useInvoiceLock,
  useSalesStaffRealtime
} from '@/features/sales/hooks'
import { type Invoice } from '@/features/sales/types'

import { ConfirmationModal } from '@/shared/components/ui-core/confirm-modal'
import { Button } from '@/shared/components/ui-core/button'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useAuthStore } from '@/store/auth.store'

import {
  ReturnTicketsTable,
  ReturnTicketDrawer,
  ReturnVerifyView
} from '@/features/sales/components/returns'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'
import { useReturnPageTickets, useMyReturnHistory } from '@/features/sales/hooks/useReturnTickets'

export default function SaleStaffOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const searchQuery = searchParams.get('search') ?? ''

  const currentUser = useAuthStore((s) => s.user)
  const staffId = (currentUser as any)?._id || (currentUser as any)?.id || undefined

  const { acquireLock, releaseLock, isLockedByOther, lockedCount } = useInvoiceLock(staffId)
  const [showLockBlockedModal, setShowLockBlockedModal] = useState(false)
  const [lockedInvoiceId, setLockedInvoiceId] = useState<string | null>(null)

  const { isRefreshing, refresh, getLastUpdatedLabel } = useSalesStaffRealtime()

  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [invoiceToProcess, setInvoiceToProcess] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const limit = 8

  const [verifyTicket, setVerifyTicket] = useState<ReturnTicketData | null>(null)
  const [drawerTicket, setDrawerTicket] = useState<ReturnTicketData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isReturnsActive = statusFilter === 'RETURNS'
  const isHistoryActive = statusFilter === 'REFUNDED_HISTORY'
  const isInvoicesActive = !isReturnsActive && !isHistoryActive

  const returnHook = useReturnPageTickets(staffId || '', isReturnsActive)
  const historyHook = useMyReturnHistory(isHistoryActive)

  useEffect(() => {
    if (statusFilter === 'RETURNS') {
      returnHook.setSearch(searchQuery)
      returnHook.setCurrentPage(page)
    } else if (statusFilter === 'REFUNDED_HISTORY') {
      historyHook.setSearch(searchQuery)
      historyHook.setCurrentPage(page)
    }
  }, [statusFilter, searchQuery, page]) // eslint-disable-line react-hooks/exhaustive-deps

  const setSearchQuery = (query: string) => {
    const next = new URLSearchParams(searchParams)
    if (query) next.set('search', query)
    else next.delete('search')
    setSearchParams(next)
  }

  useEffect(() => {
    setPage(1)
  }, [statusFilter, orderTypeFilter, searchQuery])

  const {
    invoices: invoiceList,
    pagination,
    loading: isLoading,
    fetchInvoices: refetch
  } = useSalesStaffInvoices(page, limit, statusFilter, searchQuery, isInvoicesActive)

  const selectedInvoice = useMemo(
    () => invoiceList.find((inv) => inv.id === selectedInvoiceId) ?? null,
    [invoiceList, selectedInvoiceId]
  )

  const filteredInvoices = useMemo(() => {
    let list = invoiceList

    if (statusFilter === InvoiceStatus.DEPOSITED) {
      list = list.filter((inv: Invoice) => inv.orders?.some((o) => o.isPrescription))
    }

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
        inv.orders?.some((o: any) => {
          const types = Array.isArray(o.type) ? o.type : [o.type]
          return types.some((t: any) => String(t).includes(orderTypeFilter))
        })
      )
    }

    list = list.sort((a: Invoice, b: Invoice) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return list
  }, [invoiceList, searchQuery, orderTypeFilter, statusFilter])

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

    // Override RETURN count with real data from returnHook
    counts[OrderType.RETURN] = returnHook.pagination.total || 0

    // Recalculate total with the updated return count
    const totalWithReturns = Object.values(counts).reduce((a, b) => a + b, 0) || 1

    const pct = (key: string) => Math.round((counts[key] / totalWithReturns) * 100)
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
  }, [invoiceList, returnHook.pagination.total])

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
  const statusTabs = useMemo(() => {
    const allTabs = [
      { label: 'All Invoices', value: 'All' },
      { label: 'Pending', value: InvoiceStatus.DEPOSITED },
      { label: 'Approved', value: 'APPROVED_OR_REJECTED' },
      { label: 'Returns', value: 'RETURNS' },
      { label: 'History', value: 'REFUNDED_HISTORY' }
    ]
    return allTabs
  }, [])

  const getStatusBadgeProps = (invoice: Invoice) => {
    const s = invoice.status
    const hasMfg = invoice.orders?.some((o) =>
      (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
        String(t).includes(OrderType.MANUFACTURING)
      )
    )

    if (statusFilter === 'APPROVED_OR_REJECTED') {
      if (s === InvoiceStatus.REJECTED || s === 'REJECTED') {
        return { label: 'REJECTED', color: 'bg-rose-50 text-rose-600 border-rose-100' }
      }
      if (s === InvoiceStatus.CANCELED || s === 'CANCELED' || s === InvoiceStatus.CANCEL) {
        return { label: 'CANCELED', color: 'bg-rose-50 text-rose-600 border-rose-100' }
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
        return { label: 'ACCEPTED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
      }
    }

    if (s === InvoiceStatus.DEPOSITED) {
      if (
        invoice.hasManufacturing &&
        invoice.totalOrdersCount &&
        invoice.approvedOrdersCount === invoice.totalOrdersCount
      ) {
        return {
          label: 'READY TO APPROVE',
          color: 'bg-mint-50 text-mint-600 border-mint-200'
        }
      }
      return hasMfg
        ? { label: 'PENDING', color: 'bg-amber-50 text-amber-600 border-amber-100' }
        : { label: 'WAITING ASSIGN', color: 'bg-blue-50 text-blue-600 border-blue-100' }
    }

    if (s === InvoiceStatus.APPROVED || s === 'APPROVED')
      return { label: 'APPROVED', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    if (s === InvoiceStatus.REJECTED || s === 'REJECTED')
      return { label: 'REJECTED', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    if (s === InvoiceStatus.CANCELED || s === 'CANCELED' || s === InvoiceStatus.CANCEL)
      return { label: 'CANCELED', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    if (s === InvoiceStatus.REFUNDED || s === 'REFUNDED')
      return { label: 'REFUNDED', color: 'bg-purple-50 text-purple-600 border-purple-100' }

    return {
      label: String(s).toUpperCase() || 'UNKNOWN',
      color: 'bg-slate-50 text-slate-400 border-slate-100'
    }
  }

  // Early return for Verify View

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
      {verifyTicket ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setVerifyTicket(null)}
              className="p-2.5 bg-white hover:bg-emerald-50 rounded-xl transition-all text-gray-500 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 shadow-sm"
            >
              <IoChevronBackOutline size={20} />
            </Button>
            <PageHeader
              title="Return Verification"
              breadcrumbs={[
                { label: 'Dashboard', path: '/sale-staff/dashboard' },
                { label: 'Orders', path: '/sale-staff/orders' },
                { label: 'Verification' }
              ]}
              noMargin
            />
          </div>

          {verifyTicket.staffVerify === staffId && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint-50 border border-mint-100 w-fit text-mint-700 shadow-sm animate-in slide-in-from-left-4 duration-300">
              <IoLockClosedOutline size={14} className="text-mint-600" />
              <span className="text-xs font-bold font-heading">
                You are currently verifying this return
              </span>
            </div>
          )}

          <ReturnVerifyView
            ticket={verifyTicket}
            onActionSuccess={() => {
              setVerifyTicket(null)
              returnHook.refresh()
              refetch()
              handleStatusChange('REFUNDED_HISTORY')
            }}
            currentStaffId={staffId || ''}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <PageHeader
              title="Order Management"
              breadcrumbs={[
                { label: 'Dashboard', path: '/sale-staff/dashboard' },
                { label: 'Orders' }
              ]}
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
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            onOrderTypeChange={handleOrderTypeChange}
            onReset={handleResetFilters}
            orderTypeFilter={orderTypeFilter}
          />
          <div className="bg-white border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 rounded-3xl overflow-hidden min-h-[200px]">
            {statusFilter === 'RETURNS' ? (
              <ReturnTicketsTable
                tickets={returnHook.tickets}
                isLoading={returnHook.isLoading}
                error={returnHook.error}
                currentStaffId={staffId || ''}
                pagination={returnHook.pagination}
                onRowClick={(t) => {
                  setDrawerTicket(t)
                  setDrawerOpen(true)
                }}
                onVerifyClick={(t) => setVerifyTicket(t)}
                onPageChange={setPage}
                showAction={true}
              />
            ) : statusFilter === 'REFUNDED_HISTORY' ? (
              <ReturnTicketsTable
                tickets={historyHook.tickets}
                isLoading={historyHook.isLoading}
                error={historyHook.error}
                currentStaffId={staffId || ''}
                pagination={historyHook.pagination}
                onRowClick={(t) => {
                  setDrawerTicket(t)
                  setDrawerOpen(true)
                }}
                onVerifyClick={(t) => setVerifyTicket(t)}
                onPageChange={setPage}
                showAction={true}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      <InvoiceOrdersDrawer
        isOpen={!!selectedInvoiceId && statusFilter !== InvoiceStatus.REFUNDED}
        onClose={() => setSelectedInvoiceId(null)}
        invoice={selectedInvoice}
      />

      <ReturnTicketDrawer
        ticket={drawerTicket}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentStaffId={staffId || ''}
        onGoToVerify={(t) => {
          setVerifyTicket(t)
          setDrawerOpen(false)
        }}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
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
          if (invoiceToProcess) releaseLock(invoiceToProcess)
          setShowRejectModal(false)
          setInvoiceToProcess(null)
        }}
        onConfirm={confirmRejection}
        isLoading={processing}
      />

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
