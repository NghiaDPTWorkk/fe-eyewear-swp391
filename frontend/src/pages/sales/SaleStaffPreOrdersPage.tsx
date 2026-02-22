import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Button, Card } from '@/components'
import { OrderList } from '@/features/sales/components/orders/OrderList'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { OrderFilterBar } from '@/features/sales/components/orders/OrderFilterBar'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoHourglassOutline,
  IoWarningOutline,
  IoCalendarOutline,
  IoWalletOutline
} from 'react-icons/io5'
import { PageHeader, SalesMetricCard } from '@/features/sales/components/common'
import type { Order } from '@/features/sales/types'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { useDebounce } from '@/shared/hooks'

export default function SaleStaffPreOrdersPage() {
  const navigate = useNavigate()
  // Limit to 15 orders per fetch to improve performance
  const { orders, loading, fetchOrders } = useSalesStaffOrders(1, 15)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Filter only pre-orders
  const preOrders = useMemo(
    () => orders.filter((o: Order) => o.type?.includes(OrderType.PRE_ORDER)),
    [orders]
  )

  const filteredOrders = useMemo(
    () =>
      preOrders.filter(
        (o) =>
          ((o._id || '').toString().toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            o.orderCode?.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
          (statusFilter === 'All' || o.status === statusFilter)
      ),
    [preOrders, debouncedSearch, statusFilter]
  )

  // Reset pagination when filters change
  const [prevFilters, setPrevFilters] = useState({ debouncedSearch, statusFilter })
  if (
    debouncedSearch !== prevFilters.debouncedSearch ||
    statusFilter !== prevFilters.statusFilter
  ) {
    setPrevFilters({ debouncedSearch, statusFilter })
    setCurrentPage(1)
  }

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredOrders, currentPage])

  const pendingCount = preOrders.filter((o) => o.status === 'WAITING_ASSIGN').length
  const overdueCount = 8
  const arrivingSoonCount = 24
  const totalDeposits = useMemo(
    () =>
      preOrders.reduce((sum, o) => {
        const orderTotal =
          o.products?.reduce((pSum, p) => {
            return pSum + (p.product?.pricePerUnit || 0) * (p.quantity || 1)
          }, 0) || 0
        return sum + orderTotal
      }, 0),
    [preOrders]
  )

  const handleOpenDrawer = (o: Order) => {
    setSelectedOrderId(o._id)
    setIsDrawerOpen(true)
  }

  const handleViewFullDetails = () => {
    if (selectedOrderId) {
      navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(selectedOrderId))
      setIsDrawerOpen(false)
    }
  }

  const handleVerify = (order: Order) => {
    navigate(`/salestaff/orders/${order._id}/verify-rx`)
  }

  const handleChat = (order: Order) => {
    const customerId = order.invoiceId
    alert(`Chat with ${order.customerName} (ID: ${customerId})`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pre-order Tracking"
        subtitle="Manage outstanding orders and supplier ETA updates."
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Pre-orders' }
        ]}
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SalesMetricCard
            label="Pending Orders"
            value={loading ? '...' : pendingCount.toString()}
            icon={<IoHourglassOutline size={20} />}
            trend={{ label: 'this week', value: 12, isPositive: true }}
            colorScheme="warning"
          />

          <SalesMetricCard
            label="Overdue ETA"
            value={overdueCount.toString()}
            icon={<IoWarningOutline size={20} />}
            subValue="Action required"
            colorScheme="danger"
          />

          <SalesMetricCard
            label="Arriving Soon"
            value={arrivingSoonCount.toString()}
            icon={<IoCalendarOutline size={20} />}
            subValue="Within 3 days"
            colorScheme="success"
          />

          <SalesMetricCard
            label="Total Deposits"
            value={`$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<IoWalletOutline size={20} />}
            subValue="Held securely"
            colorScheme="info"
          />
        </div>

        <OrderFilterBar
          search={search}
          setSearch={setSearch}
          filter={statusFilter}
          setFilter={setStatusFilter}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          filterOptions={[
            { label: 'All Status', value: 'All' },
            { label: 'Waiting Assign', value: 'WAITING_ASSIGN' },
            { label: 'Processing', value: 'PROCESSING' },
            { label: 'Completed', value: 'COMPLETED' }
          ]}
          placeholder="Search by Order ID, Customer Name..."
          onExport={() => {}}
          onAdd={() => {}}
        />

        <Card className="p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40 ring-1 ring-neutral-100/50 bg-white rounded-[32px]">
          <OrderList
            orders={paginatedOrders}
            loading={loading}
            onVerify={handleVerify}
            onViewDetail={handleOpenDrawer}
            onChat={handleChat}
          />
        </Card>

        <div className="flex items-center justify-between px-2 text-sm text-gray-500 mt-6">
          <span>
            Showing {filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}{' '}
            orders
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-2 border-neutral-200"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline />
            </Button>
            <span className="flex items-center px-2 font-semibold text-primary">
              Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage) || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="px-2 border-neutral-200"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(Math.ceil(filteredOrders.length / itemsPerPage), p + 1)
                )
              }
              disabled={currentPage >= Math.ceil(filteredOrders.length / itemsPerPage)}
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      </div>

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onUpdate={fetchOrders}
        onViewFullDetails={handleViewFullDetails}
      />
    </div>
  )
}
