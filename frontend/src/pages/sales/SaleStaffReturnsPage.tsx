import { useState } from 'react'
import { Button } from '@/components'
import ReturnDetails from '@/features/sales/components/returns/ReturnDetails'
import ReturnsTable from '@/features/sales/components/returns/ReturnsTable'
import { ReturnDetailsDrawer } from '@/features/sales/components/returns/ReturnDetailsDrawer'
import { IoSearchOutline, IoRefreshOutline } from 'react-icons/io5'

import { PageHeader } from '@/features/sales/components/common'
import { useSaleStaffReturns } from '@/features/sales/hooks/useSaleStaffReturns'

export default function SaleStaffReturnsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [viewDetailId, setViewDetailId] = useState<string | null>(null)

  const { returns, pagination, isLoading, refetch } = useSaleStaffReturns({
    page,
    limit: 10,
    search: search || undefined
  })

  // Handle row click: open drawer for basic info
  const handleRowClick = (id: string) => {
    setSelectedTicketId(id)
    setIsDrawerOpen(true)
  }

  // Handle "View Full Details" from drawer
  const handleViewFullDetails = (id: string) => {
    setIsDrawerOpen(false)
    setViewDetailId(id)
  }

  if (viewDetailId) {
    return <ReturnDetails returnId={viewDetailId} onBack={() => setViewDetailId(null)} />
  }

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Returns Management"
        subtitle="Process customer returns and refunds."
        breadcrumbs={[
          { label: 'Dashboard', path: '/sale-staff/dashboard' },
          { label: 'Orders', path: '/sale-staff/orders' },
          { label: 'Returns' }
        ]}
      />

      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search Return ID, Order #..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoRefreshOutline className={isLoading ? 'animate-spin' : ''} />}
            className="rounded-xl font-semibold"
            onClick={() => refetch()}
          >
            Refresh List
          </Button>
        </div>

        <ReturnsTable
          returns={returns}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
        />
      </div>

      <ReturnDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        returnId={selectedTicketId}
        onViewFullDetails={handleViewFullDetails}
      />
    </div>
  )
}
