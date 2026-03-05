import { useState } from 'react'
import { Container, OperationPagination } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { IoAirplaneOutline } from 'react-icons/io5'
import { useNavigate, useSearchParams } from 'react-router-dom'
import OperationInvoicePopup from './OperationInvoicePopup'
import InvoiceTable from '@/components/layout/staff/operationstaff/operationinvoiceshipping/InvoiceTable'
import {
  useOperationInvoices,
  useAllOperationInvoices
} from '@/features/operations/hooks/useOperationInvoices'
import type { OperationInvoiceListItem } from '@/shared/types'
import { FilterButtonList } from '@/components/staff'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
// import OperationPagination from '@/pages/operations/OperationPagination'

const PAGE_LIMIT = 10

export default function OperationAllInvoices() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedInvoice, setSelectedInvoice] = useState<OperationInvoiceListItem | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data, isLoading, isError } = useOperationInvoices(
    currentPage,
    PAGE_LIMIT,
    statusFilter === 'all' ? undefined : statusFilter
  )

  // Lấy toàn bộ invoices để tính count cho badges
  const { data: allData } = useAllOperationInvoices()
  const allInvoicesRaw = allData?.data?.invoiceList ?? []

  const invoices = data?.data?.invoiceList ?? []
  const pagination = data?.data?.pagination

  // Tính toán số lượng cho từng status
  const counts = {
    all: allData?.data?.pagination?.total ?? 0,
    completed: allInvoicesRaw.filter((inv) => inv.status === InvoiceStatus.COMPLETED).length,
    readyToShip: allInvoicesRaw.filter((inv) => inv.status === InvoiceStatus.READY_TO_SHIP).length,
    delivering: allInvoicesRaw.filter((inv) => inv.status === InvoiceStatus.DELIVERING).length,
    delivered: allInvoicesRaw.filter((inv) => inv.status === InvoiceStatus.DELIVERED).length
  }

  const setStatusFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ status: value })
    }
  }

  const handleViewInvoice = (invoice: OperationInvoiceListItem) => {
    setSelectedInvoice(invoice)
    setIsSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
    setTimeout(() => setSelectedInvoice(null), 300)
  }

  const handleNextInvoice = (invoiceId: string) => {
    navigate(`/operationstaff/shipping-handover/${invoiceId}`)
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Completed', count: counts.completed, value: InvoiceStatus.COMPLETED },
    { label: 'Ready to Ship', count: counts.readyToShip, value: InvoiceStatus.READY_TO_SHIP },
    { label: 'Delivering', count: counts.delivering, value: InvoiceStatus.DELIVERING },
    { label: 'Delivered', count: counts.delivered, value: InvoiceStatus.DELIVERED }
  ]

  return (
    <>
      <Container>
        {/* Header */}
        <div className="mb-8">
          <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <IoAirplaneOutline className="text-mint-600" /> Shipping Handover
          </h1>
          <p className="text-gray-500 mt-1">Manage invoices ready for shipping and delivery.</p>
        </div>

        <FilterButtonList
          buttons={filterButtons}
          selectedValue={statusFilter}
          onChange={setStatusFilter}
          className="mb-6"
        />

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          {isLoading ? (
            /* ── Loading state ── */
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-neutral-100" />
                <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-mint-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-700">Loading invoices</p>
                <p className="text-xs text-neutral-400 mt-0.5">Please wait a moment...</p>
              </div>
            </div>
          ) : isError ? (
            /* ── Error state ── */
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <IoAirplaneOutline className="text-red-400" size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-700">Failed to load invoices</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Check your connection and try refreshing the page.
                </p>
              </div>
            </div>
          ) : invoices.length === 0 ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                <IoAirplaneOutline className="text-neutral-300" size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-600">No invoices found</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  There are currently no invoices ready for shipping handover.
                </p>
              </div>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onView={handleViewInvoice}
              onNext={handleNextInvoice}
            />
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <OperationPagination
            page={currentPage}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={PAGE_LIMIT}
            itemsOnPage={invoices.length}
            onPageChange={setCurrentPage}
          />
        )}
      </Container>

      {/* Invoice Detail Sidebar (Popup) */}
      {selectedInvoice && (
        <OperationInvoicePopup
          isOpen={isSidebarOpen}
          selectedInvoice={selectedInvoice}
          onClose={handleCloseSidebar}
          onNext={handleNextInvoice}
        />
      )}
    </>
  )
}
