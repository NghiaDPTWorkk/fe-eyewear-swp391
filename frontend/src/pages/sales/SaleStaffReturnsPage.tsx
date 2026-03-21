import { useState } from 'react'
import { Button } from '@/components'
import ReturnDetails from '@/features/sales/components/returns/ReturnDetails'
import { IoSearchOutline, IoRefreshOutline } from 'react-icons/io5'
import { PageHeader } from '@/features/sales/components/common'
import { useReturnTickets } from '@/features/manager/hooks/useReturnTickets'
import ReturnsTable from '@/features/sales/components/returns/ReturnsTable'
import type { ReturnTicket } from '@/shared/types'

export default function SaleStaffReturnsPage() {
  const [selectedTicket, setSelectedTicket] = useState<ReturnTicket | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  const { data, isLoading, isError, refetch } = useReturnTickets({
    page,
    limit,
    search: search || undefined
  })

  const returnTickets = data?.returnTicketList ?? []
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 1 }

  if (selectedTicket) {
    return (
      <ReturnDetails
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
        onStatusChanged={() => {
          refetch()
          setSelectedTicket(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
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
            leftIcon={<IoRefreshOutline />}
            className="rounded-xl font-semibold"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>

        <ReturnsTable
          data={returnTickets}
          pagination={pagination}
          isLoading={isLoading}
          isError={isError}
          onRowClick={(ticket) => setSelectedTicket(ticket)}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  )
}
