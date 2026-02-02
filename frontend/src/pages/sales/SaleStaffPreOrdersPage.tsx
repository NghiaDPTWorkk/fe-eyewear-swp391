import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Container, Button, Card } from '@/components'
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
import { PageHeader } from '@/features/sales/components/common'
import MetricCard from '@/features/sales/components/common/MetricCard'
import type { Order } from '@/features/sales/types'

export default function SaleStaffPreOrdersPage() {
  const navigate = useNavigate()
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter only pre-orders
  const preOrders = useMemo(() => orders.filter((o) => o.type?.includes('PRE-ORDER')), [orders])

  const filteredOrders = useMemo(
    () =>
      preOrders.filter(
        (o) =>
          ((o._id || '').toString().toLowerCase().includes(search.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            o.orderCode?.toLowerCase().includes(search.toLowerCase())) &&
          (statusFilter === 'All' || o.status === statusFilter)
      ),
    [preOrders, search, statusFilter]
  )

  const pendingCount = preOrders.filter((o) => o.status === 'WAITING_ASSIGN').length
  const overdueCount = 8
  const arrivingSoonCount = 24
  const totalDeposits = preOrders.reduce((sum, o) => {
    const orderTotal =
      o.products?.reduce((pSum, p) => {
        return pSum + (p.product?.pricePerUnit || 0) * (p.quantity || 1)
      }, 0) || 0
    return sum + orderTotal
  }, 0)

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
    console.log('Opening chat with customer:', customerId)
    alert(`Chat with ${order.customerName} (ID: ${customerId})`)
  }

  return (
    <Container>
      <PageHeader
        title="Pre-order Tracking"
        subtitle="Manage outstanding orders and supplier ETA updates."
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
          { label: 'Pre-order Management' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="Pending Orders"
          value={loading ? '...' : pendingCount.toString()}
          icon={<IoHourglassOutline size={20} />}
          trend="+12% this week"
          trendColor="text-emerald-500"
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
        />

        <MetricCard
          label="Overdue ETA"
          value={overdueCount.toString()}
          icon={<IoWarningOutline size={20} />}
          trend="Action required"
          trendColor="text-red-500"
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />

        <MetricCard
          label="Arriving Soon"
          value={arrivingSoonCount.toString()}
          icon={<IoCalendarOutline size={20} />}
          trend="Within 3 days"
          trendColor="text-neutral-500"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />

        <MetricCard
          label="Total Deposits"
          value={`$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<IoWalletOutline size={20} />}
          trend="Held securely"
          trendColor="text-neutral-500"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
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

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm bg-white rounded-xl mt-6">
        <OrderList
          orders={filteredOrders}
          loading={loading}
          onVerify={handleVerify}
          onViewDetail={handleOpenDrawer}
          onChat={handleChat}
        />
      </Card>

      <div className="flex items-center justify-between px-2 text-sm text-gray-500 mt-6 bottom-0">
        <span>
          Showing 1-{filteredOrders.length} of {preOrders.length} pre-orders
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="px-2 border-neutral-200">
            <IoChevronBackOutline />
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            size="sm"
            className="min-w-[32px] font-semibold"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="px-2 border-neutral-200">
            <IoChevronForwardOutline />
          </Button>
        </div>
      </div>

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onUpdate={fetchOrders}
        onViewFullDetails={handleViewFullDetails}
      />
    </Container>
  )
}
