import { useState } from 'react'
import { Container } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { IoAirplaneOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import OperationInvoicePopup from './OperationInvoicePopup'
import InvoiceTable from '@/components/layout/staff/operationstaff/operationinvoiceshipping/InvoiceTable'
import { useOperationInvoices } from '@/features/operations/hooks/useOperationInvoices'
import type { OperationInvoiceListItem } from '@/shared/types'

export default function OperationAllInvoices() {
  const navigate = useNavigate()
  const [selectedInvoice, setSelectedInvoice] = useState<OperationInvoiceListItem | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data, isLoading, isError } = useOperationInvoices(1, 20)
  const invoices = data?.data?.invoiceList ?? []

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

  return (
    <>
      <Container>
        {/* Breadcrumb */}
        <BreadcrumbPath paths={['Dashboard', 'Shipping Handover']} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <IoAirplaneOutline className="text-mint-600" /> Shipping Handover
            </h1>
            <p className="text-gray-500 mt-1">Manage invoices ready for shipping and delivery.</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-500 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Loading invoices...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <IoAirplaneOutline className="mx-auto text-red-400 mb-4" size={48} />
              <p className="text-red-500">Failed to load invoices. Please try again.</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <IoAirplaneOutline className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No invoices found</p>
            </div>
          ) : (
            <InvoiceTable
              invoices={invoices}
              onView={handleViewInvoice}
              onNext={handleNextInvoice}
            />
          )}
        </div>
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
