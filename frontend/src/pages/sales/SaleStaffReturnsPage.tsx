import { useState, useCallback, useRef } from 'react'
import {
  IoSearchOutline,
  IoRefreshOutline,
  IoTimerOutline,
  IoCheckmarkDoneOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoLockClosedOutline
} from 'react-icons/io5'
import { PageHeader } from '@/features/sales/components/common'
import ReturnTicketsTable from '@/features/sales/components/returns/ReturnTicketsTable'
import ReturnTicketDrawer from '@/features/sales/components/returns/ReturnTicketDrawer'
import ReturnVerifyView from '@/features/sales/components/returns/ReturnVerifyView'
import { useReturnPageTickets, useReturnedOrders } from '@/features/sales/hooks/useReturnTickets'
import { useAuthStore } from '@/store/auth.store'
import type { AdminAccount } from '@/shared/types'
import type { ReturnTicketData } from '@/shared/types/return-ticket.types'
import { Button } from '@/shared/components/ui-core'

type TabId = 'return' | 'returned'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  {
    id: 'return',
    label: 'Return',
    icon: <IoTimerOutline size={16} />
  },
  {
    id: 'returned',
    label: 'Returned',
    icon: <IoCheckmarkDoneOutline size={16} />
  }
]

export default function SaleStaffReturnsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('return')
  const [drawerTicket, setDrawerTicket] = useState<ReturnTicketData | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [verifyTicket, setVerifyTicket] = useState<ReturnTicketData | null>(null)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Get current staff's ID from auth store
  const user = useAuthStore((s) => s.user) as AdminAccount | null
  const currentStaffId = user?._id || ''

  // Hooks for each tab — useReturnPageTickets needs currentStaffId to filter & sort
  const returnHook = useReturnPageTickets(currentStaffId)
  const returnedHook = useReturnedOrders()

  const activeHook = activeTab === 'return' ? returnHook : returnedHook

  // ── Drawer ────────────────────────────────────────────────────────────────
  const openDrawer = useCallback((ticket: ReturnTicketData) => {
    setDrawerTicket(ticket)
    setDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setTimeout(() => setDrawerTicket(null), 300)
  }, [])

  // ── Go to full-screen verify ───────────────────────────────────────────────
  const openVerify = useCallback(
    (ticket: ReturnTicketData) => {
      closeDrawer()
      setTimeout(() => setVerifyTicket(ticket), 320)
    },
    [closeDrawer]
  )

  // ── Search debounce ────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      activeHook.setSearch(val)
      activeHook.setCurrentPage(1)
    }, 450)
  }

  // ── Full-Screen: Verify View ───────────────────────────────────────────────
  if (verifyTicket) {
    return (
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
              { label: 'Returns', path: '/sale-staff/returns' },
              { label: 'Verification' }
            ]}
            noMargin
          />
        </div>

        {/* Verifying Status Banner */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-mint-50 border border-mint-100 w-fit text-mint-700 shadow-sm animate-in slide-in-from-left-4 duration-300">
          <IoLockClosedOutline size={14} className="text-mint-600" />
          <span className="text-xs font-bold font-heading">
            You are currently verifying this return
          </span>
        </div>

        <ReturnVerifyView
          ticket={verifyTicket}
          onActionSuccess={() => {
            setVerifyTicket(null)
            returnHook.refresh()
            returnedHook.refresh()
          }}
          currentStaffId={currentStaffId}
        />
      </div>
    )
  }

  // ── Main Page ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      <PageHeader
        title="Returns Management"
        subtitle="Manage customer return requests, verify tickets, and process refunds."
        breadcrumbs={[
          { label: 'Dashboard', path: '/sale-staff/dashboard' },
          { label: 'Orders', path: '/sale-staff/orders' },
          { label: 'Returns' }
        ]}
      />

      {/* Tab + Search bar row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        {/* Tab pills */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                closeDrawer()
                setVerifyTicket(null)
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 shadow-sm shadow-slate-200/80'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab.icon}
              {tab.label}
              {/* Count badge */}
              {activeTab === tab.id && (
                <span
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                  bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full"
                >
                  {activeHook.pagination.total}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2 flex-1 sm:justify-end">
          <div className="relative max-w-xs w-full">
            <IoSearchOutline
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search tickets…"
              onChange={handleSearchChange}
              className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-emerald-300/50 focus:border-emerald-400
                transition-all placeholder:text-slate-400 text-slate-700"
            />
            {activeHook.search && (
              <button
                onClick={() => {
                  activeHook.setSearch('')
                  activeHook.setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <IoCloseOutline size={15} />
              </button>
            )}
          </div>
          <button
            onClick={activeHook.refresh}
            disabled={activeHook.isLoading}
            title="Refresh"
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl
              hover:bg-emerald-50 hover:border-emerald-300 text-slate-400 hover:text-emerald-600
              transition-all disabled:opacity-50"
          >
            <IoRefreshOutline size={17} className={activeHook.isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tab description strip */}
      {activeTab === 'return' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
          <IoTimerOutline className="text-amber-500 shrink-0" size={15} />
          Showing <strong>PENDING</strong> and <strong>IN-PROGRESS</strong> tickets. Click any row
          to view details, or use the action button to start processing.
        </div>
      )}
      {activeTab === 'returned' && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
          <IoCheckmarkDoneOutline className="text-emerald-500 shrink-0" size={15} />
          Showing completed tickets with statuses <strong>RETURNED</strong>,{' '}
          <strong>APPROVED</strong>, and <strong>REJECTED</strong>. Read-only view.
        </div>
      )}

      {/* Table */}
      {activeTab === 'return' ? (
        <ReturnTicketsTable
          tickets={returnHook.tickets}
          isLoading={returnHook.isLoading}
          error={returnHook.error}
          currentStaffId={currentStaffId}
          pagination={returnHook.pagination}
          onRowClick={openDrawer}
          onVerifyClick={openVerify}
          onPageChange={(p) => returnHook.setCurrentPage(p)}
          showAction={true}
        />
      ) : (
        <ReturnTicketsTable
          tickets={returnedHook.tickets}
          isLoading={returnedHook.isLoading}
          error={returnedHook.error}
          currentStaffId={currentStaffId}
          pagination={returnedHook.pagination}
          onRowClick={openDrawer}
          onVerifyClick={openVerify}
          onPageChange={(p) => returnedHook.setCurrentPage(p)}
          showAction={false}
        />
      )}

      {/* Drawer */}
      <ReturnTicketDrawer
        ticket={drawerTicket}
        open={drawerOpen}
        onClose={closeDrawer}
        currentStaffId={currentStaffId}
        onGoToVerify={openVerify}
      />
    </div>
  )
}
