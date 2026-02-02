import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Container, Button, Card } from '@/components'
import SaleStaffOrderTable from '@/features/sales/components/SaleStaffOrderTable/SaleStaffOrderTable'
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
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <Link
            to="/salestaff/orders"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Orders
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Pre-order Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Pre-order Tracking</h1>
        <p className="text-gray-500 mt-1">Manage outstanding orders and supplier ETA updates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Pending Orders
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">
                {loading ? '...' : pendingCount}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
              <IoHourglassOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-500">+12% this week</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Overdue ETA
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <IoWarningOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-semibold text-red-500">Action required</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Arriving Soon
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <IoCalendarOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">Within 3 days</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Total Deposits
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">$12,450</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <IoWalletOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">Held securely</div>
        </Card>
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
