import { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  IoEyeOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
  IoPersonCircleOutline,
  IoCalendarOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { salesService } from '@/features/sale-staff/services/salesService'
import { InvoiceOrdersDrawer } from '@/features/sale-staff/components/dashboard/InvoiceOrdersDrawer'
import { OrderPagination } from '@/features/sale-staff/components/orders/OrderPagination'
import { StatusFilterBar } from '@/features/sale-staff/components/orders/StatusFilterBar'
import { RealtimeStatusBar } from '@/features/sale-staff/components/orders/RealtimeStatusBar'
import { PageHeader } from '@/features/sale-staff/components/common'
import { useSalesStaffAction } from '@/features/sale-staff/hooks/useSalesStaffAction'
import { useSalesStaffInvoices } from '@/features/sale-staff/hooks/useSalesStaffInvoices'
import { useInvoiceLock } from '@/features/sale-staff/hooks/useInvoiceLock'
import { useSalesStaffRealtime } from '@/features/sale-staff/hooks/useSalesStaffRealtime'
import { type Invoice } from '@/features/sale-staff/types'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useAuthStore } from '@/store/auth.store'
import { OrderMetricsSection } from './components/OrderMetricsSection'
import { InvoiceProcessingModals } from './components/InvoiceProcessingModals'
import { OrderTable, type Column } from '@/shared/components/staff/staff-core/order-table'
import { Button } from '@/shared/components/ui'
import { cn } from '@/lib/utils'

export default function SaleStaffOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'All'
  const orderTypeFilter = searchParams.get('orderType') ?? 'All'
  const searchQuery = searchParams.get('search') ?? ''
  const currentUser = useAuthStore((s) => s.user)
  const staffId = (currentUser as any)?._id || (currentUser as any)?.id || undefined
  const { acquireLock, releaseLock, isLockedByOther, lockedCount } = useInvoiceLock(staffId)
  const { isRefreshing, refresh, getLastUpdatedLabel } = useSalesStaffRealtime()
  const { approveInvoice, rejectInvoice, processing } = useSalesStaffAction()
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showLockBlockedModal, setShowLockBlockedModal] = useState(false)
  const [invoiceToProcess, setInvoiceToProcess] = useState<string | null>(null)
  const [lockedInvoiceId, setLockedInvoiceId] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setPage(1)
  }, [statusFilter, orderTypeFilter, searchQuery])

  const {
    invoices: invoiceList,
    pagination,
    loading: isLoading,
    fetchInvoices: refetch
  } = useSalesStaffInvoices(page, 8, statusFilter, searchQuery)

  const filteredInvoices = useMemo(() => {
    let list = [...invoiceList]
    if (statusFilter === InvoiceStatus.DEPOSITED)
      list = list.filter((inv) => inv.orders?.some((o) => o.isPrescription))
    if (statusFilter === InvoiceStatus.REFUNDED)
      list = list.filter((inv) =>
        inv.orders?.some((o) =>
          (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
            String(t).includes(OrderType.RETURN)
          )
        )
      )
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (inv) =>
          inv.fullName.toLowerCase().includes(q) ||
          inv.invoiceCode.toLowerCase().includes(q) ||
          inv.phone.includes(q)
      )
    }
    if (orderTypeFilter !== 'All')
      list = list.filter((inv) =>
        inv.orders?.some((o) =>
          (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
            String(t).includes(orderTypeFilter)
          )
        )
      )
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [invoiceList, searchQuery, orderTypeFilter, statusFilter])

  const adjustedTotalPages =
    filteredInvoices.length === 0 && page === 1 ? 1 : pagination?.totalPages || 1

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

  const { data: statusCounts } = useQuery({
    queryKey: ['sales', 'status-counts'],
    queryFn: async () => {
      const tabs = [InvoiceStatus.DEPOSITED, 'APPROVED_OR_REJECTED', InvoiceStatus.REFUNDED]
      const counts: Record<string, number> = {}
      await Promise.all(
        tabs.map(async (tab) => {
          let apiS, apiSs
          if (tab === 'APPROVED_OR_REJECTED')
            apiSs = [
              InvoiceStatus.APPROVED,
              InvoiceStatus.ONBOARD,
              InvoiceStatus.READY_TO_SHIP,
              InvoiceStatus.DELIVERING,
              InvoiceStatus.DELIVERED,
              InvoiceStatus.COMPLETED,
              InvoiceStatus.REJECTED,
              InvoiceStatus.CANCELED
            ].join(',')
          else apiS = tab
          const res = await salesService.getDepositedInvoices(1, 1, apiS, apiSs)
          counts[tab] = res.data.pagination.total
        })
      )
      return counts
    },
    staleTime: 30000
  })

  const statusTabs = useMemo(
    () =>
      [
        { label: 'All Invoices', value: 'All' },
        { label: 'Pending', value: InvoiceStatus.DEPOSITED },
        { label: 'Approved', value: 'APPROVED_OR_REJECTED' },
        { label: 'Refunded', value: InvoiceStatus.REFUNDED }
      ].filter((t) => t.value === 'All' || (statusCounts?.[t.value] ?? 0) > 0),
    [statusCounts]
  )

  const getStatusBadgeProps = (inv: Invoice) => {
    const s = inv.status
    if (statusFilter === 'APPROVED_OR_REJECTED') {
      if ([InvoiceStatus.REJECTED, 'REJECTED', InvoiceStatus.CANCELED].includes(s as any))
        return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
      return { label: 'Accepted', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    }
    if (s === InvoiceStatus.DEPOSITED) {
      if (inv.hasManufacturing && inv.approvedOrdersCount === inv.totalOrdersCount)
        return {
          label: 'Ready to Approve Final',
          color: 'bg-mint-50 text-mint-600 border-mint-200'
        }
      return inv.orders?.some((o) =>
        (Array.isArray(o.type) ? o.type : [o.type]).some((t) =>
          String(t).includes(OrderType.MANUFACTURING)
        )
      )
        ? { label: 'Wait Verify', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }
        : { label: 'Pending', color: 'bg-slate-50 text-slate-500 border-slate-200' }
    }
    if ([InvoiceStatus.APPROVED, 'APPROVED'].includes(s as any))
      return { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    if ([InvoiceStatus.REJECTED, 'REJECTED'].includes(s as any))
      return { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-100' }
    if ([InvoiceStatus.REFUNDED, 'REFUNDED'].includes(s as any))
      return { label: 'Refunded', color: 'bg-purple-50 text-purple-600 border-purple-100' }
    return { label: String(s), color: 'bg-slate-50 text-slate-400 border-slate-100' }
  }

  const columns: Column<Invoice>[] = [
    {
      header: 'Customer',
      render: (inv) => (
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100 shadow-sm shrink-0">
            <IoPersonCircleOutline size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-700 leading-tight">{inv.fullName}</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight">
              {inv.invoiceCode}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (inv) => {
        const b = getStatusBadgeProps(inv)
        const isLocked = isLockedByOther(inv.id)
        return (
          <div className="flex flex-col gap-1.5 items-start">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border',
                b.color
              )}
            >
              {b.label === 'Ready to Approve Final' && <IoShieldCheckmarkOutline size={12} />}
              {b.label}
            </span>
            {isLocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-[8px] font-bold rounded border border-amber-100">
                <IoLockClosedOutline size={10} /> BUSY
              </span>
            )}
          </div>
        )
      }
    },
    {
      header: 'Date',
      render: (inv) => (
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <IoCalendarOutline className="text-slate-300" size={14} />
          <span>{inv.createdAt ? inv.createdAt.split(' ')[0] : 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Created At',
      render: (inv) => (
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <IoTimeOutline className="text-slate-300" size={14} />
          <span>{inv.createdAt ? inv.createdAt.split(' ')[1] : 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      headerClassName: 'text-center',
      render: (inv) => {
        const isLocked = isLockedByOther(inv.id)
        const isReadyToApprove =
          inv.hasManufacturing &&
          inv.status === InvoiceStatus.DEPOSITED &&
          (inv.totalOrdersCount || 0) > 0 &&
          (inv.approvedOrdersCount || 0) === (inv.totalOrdersCount || 0)
        return (
          <div
            className="flex items-center justify-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              className={cn(
                'rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9 border-none min-w-[140px]',
                isLocked
                  ? 'bg-amber-50 text-amber-400 cursor-not-allowed'
                  : isReadyToApprove
                    ? 'bg-emerald-500/15 text-emerald-700'
                    : 'bg-mint-500/10 text-mint-600'
              )}
              onClick={() => {
                if (isLocked) return
                if (isReadyToApprove) handleApproveClick(inv.id)
                else setSelectedInvoiceId(inv.id)
              }}
              disabled={processing || isLocked}
              leftIcon={
                isLocked ? (
                  <IoLockClosedOutline size={14} />
                ) : isReadyToApprove ? (
                  <IoShieldCheckmarkOutline size={14} />
                ) : (
                  <IoEyeOutline size={14} />
                )
              }
            >
              {isLocked ? 'LOCKED' : isReadyToApprove ? 'FINAL APPROVE' : 'VIEW DETAILS'}
            </Button>
          </div>
        )
      }
    }
  ]

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
        <OrderMetricsSection
          invoiceList={invoiceList}
          orderTypeFilter={orderTypeFilter}
          onOrderTypeChange={(t) => {
            setSearchParams((p) => {
              if (t === 'All') p.delete('orderType')
              else p.set('orderType', t)
              return p
            })
            setPage(1)
            setIsFilterOpen(false)
          }}
        />
        <StatusFilterBar
          statusTabs={statusTabs}
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setSearchParams((p) => {
              if (s === 'All') p.delete('status')
              else p.set('status', s)
              return p
            })
            setPage(1)
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            const n = new URLSearchParams(searchParams)
            if (q) n.set('search', q)
            else n.delete('search')
            setSearchParams(n)
          }}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
          onReset={() => {
            setSearchParams(new URLSearchParams())
            setPage(1)
          }}
          orderTypeFilter={orderTypeFilter}
        />
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50">
          <OrderTable
            data={filteredInvoices}
            columns={columns}
            isLoading={isLoading}
            onRowClick={(inv) => setSelectedInvoiceId(inv.id)}
            emptyMessage="No invoices found matching your criteria."
          />
          {adjustedTotalPages > 0 && (
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
        invoice={invoiceList.find((i) => i.id === selectedInvoiceId) ?? null}
      />
      <InvoiceProcessingModals
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        showLockBlockedModal={showLockBlockedModal}
        setShowLockBlockedModal={setShowLockBlockedModal}
        invoiceToProcess={invoiceToProcess}
        setInvoiceToProcess={setInvoiceToProcess}
        lockedInvoiceId={lockedInvoiceId}
        setLockedInvoiceId={setLockedInvoiceId}
        invoiceList={invoiceList}
        processing={processing}
        confirmApproval={async () => {
          if (invoiceToProcess) {
            await approveInvoice(invoiceToProcess)
            releaseLock(invoiceToProcess)
            refetch()
            setShowConfirmModal(false)
            setInvoiceToProcess(null)
          }
        }}
        confirmRejection={async (note) => {
          if (invoiceToProcess) {
            await rejectInvoice(invoiceToProcess, note)
            releaseLock(invoiceToProcess)
            refetch()
            setShowRejectModal(false)
            setInvoiceToProcess(null)
          }
        }}
        releaseLock={releaseLock}
      />
    </div>
  )
}
