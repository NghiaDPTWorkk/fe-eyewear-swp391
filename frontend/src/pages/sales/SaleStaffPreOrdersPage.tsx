import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Container, Button, Card } from '@/components'
import { OrdersDetailsDrawer, OrdersTable } from '@/features/sales/components/orders'
import { OrderPagination } from '@/features/sales/components/OrderPagination'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import {
  IoCloudDownloadOutline,
  IoAdd,
  IoHourglassOutline,
  IoCalendarOutline,
  IoWalletOutline,
  IoCheckboxOutline
} from 'react-icons/io5'
import { OrderType } from '@/shared/utils/enums/order.enum'

export default function SaleStaffPreOrdersPage() {
  const navigate = useNavigate()
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const [SelectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleOpenDrawer = (id: string) => {
    setSelectedOrderId(id)
    setIsDrawerOpen(true)
  }

  const handleViewFullDetails = () => {
    if (SelectedOrderId) {
      navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(SelectedOrderId))
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
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Pending Pre-orders
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">
                {loading
                  ? '...'
                  : orders.filter(
                      (o) => o.orderType === OrderType.PRE_ORDER && o.status === 'WAITING_ASSIGN'
                    ).length}
              </h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
              <IoHourglassOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-500">Awaiting processing</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Processing
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">
                {
                  orders.filter(
                    (o) => o.orderType === OrderType.PRE_ORDER && o.status === 'PROCESSING'
                  ).length
                }
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <IoCalendarOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">In supplier cycle</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Completed
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">
                {
                  orders.filter(
                    (o) => o.orderType === OrderType.PRE_ORDER && o.status === 'COMPLETED'
                  ).length
                }
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <IoCheckboxOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-emerald-500">Ready for pickup</div>
        </Card>

        <Card className="p-5 border border-neutral-100 flex flex-col justify-between shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Total Orders
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">
                {orders.filter((o) => o.orderType === OrderType.PRE_ORDER).length}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <IoWalletOutline size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-neutral-500">Lifetime total</div>
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

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm rounded-xl">
        <OrdersTable
          orders={orders.filter(
            (o) => o.orderType === 'PRE-ORDER' || o.orderType?.includes('PREORDER')
          )}
          onRowClick={(id) => handleOpenDrawer(id)}
        />
      </Card>

      <OrderPagination total={orders.length} currentPage={1} pageSize={10} />

      <OrdersDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={SelectedOrderId}
        onViewFullDetails={handleViewFullDetails}
      />
    </Container>
  )
}
