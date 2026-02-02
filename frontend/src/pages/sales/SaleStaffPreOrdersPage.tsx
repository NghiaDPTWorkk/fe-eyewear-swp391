import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Container, Button, Card } from '@/components'
import SaleStaffOrderTable from '@/features/sales/components/orders/OrderTable'
import OrderDetailsDrawer from '@/features/sales/components/orders/OrderDetailsDrawer'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import {
  IoCloudDownloadOutline,
  IoAdd,
  IoHourglassOutline,
  IoWarningOutline,
  IoCalendarOutline,
  IoWalletOutline
} from 'react-icons/io5'
import PageHeader from '@/features/sales/components/common/PageHeader'
import MetricCard from '@/features/sales/components/common/MetricCard'

export default function SaleStaffPreOrdersPage() {
  const navigate = useNavigate()
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const pendingCount = orders.filter((o) => o.status === 'WAITING_ASSIGN').length

  const handleOpenDrawer = (id: string) => {
    setSelectedOrderId(id)
    setIsDrawerOpen(true)
  }

  const handleViewFullDetails = () => {
    if (selectedOrderId) {
      navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(selectedOrderId))
      setIsDrawerOpen(false)
    }
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
          value="8"
          icon={<IoWarningOutline size={20} />}
          trend="Action required"
          trendColor="text-red-500"
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />

        <MetricCard
          label="Arriving Soon"
          value="24"
          icon={<IoCalendarOutline size={20} />}
          trend="Within 3 days"
          trendColor="text-neutral-500"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />

        <MetricCard
          label="Total Deposits"
          value="$12,450"
          icon={<IoWalletOutline size={20} />}
          trend="Held securely"
          trendColor="text-neutral-500"
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-xl w-full"></div>
        <div className="flex gap-3 justify-end w-full md:w-auto">
          <Button variant="outline" colorScheme="neutral" leftIcon={<IoCloudDownloadOutline />}>
            Export
          </Button>
          <Button variant="solid" colorScheme="primary" leftIcon={<IoAdd />}>
            New Pre-order
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <SaleStaffOrderTable
          orders={orders}
          loading={loading}
          onRowClick={handleOpenDrawer}
          filterType="Pre-order"
        />
      </Card>

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onViewFullDetails={handleViewFullDetails}
      />
    </Container>
  )
}
