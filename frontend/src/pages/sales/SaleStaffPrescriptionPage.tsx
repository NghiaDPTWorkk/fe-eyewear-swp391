import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Container, Button, Card } from '@/components'
import { OrderTable, OrderDetailsDrawer } from '@/features/sales/components/orders'
import type { Order } from '@/features/sales/components/orders/OrderTable'
import {
  IoFilter,
  IoAdd,
  IoFlaskOutline,
  IoSync,
  IoCheckmarkDoneCircleOutline,
  IoCheckboxOutline
} from 'react-icons/io5'

const MOCK_PRESCRIPTION_ORDERS: Order[] = [
  {
    id: 'ORD-7352',
    orderType: 'Prescription',
    customer: 'Leslie Alexander',
    customerPhone: '+1 (555) 123-4567',
    item: 'Ray-Ban Aviator',
    waitingFor: 'Lens Grinding',
    currentStatus: 'In Production',
    timeElapsed: '2h 15m',
    statusColor: 'bg-blue-100 text-blue-700',
    isNextActive: true,
    isApproved: false,
    customerId: 'CUST-001'
  },
  {
    id: 'ORD-7349',
    orderType: 'Prescription',
    customer: 'Lindsay Walton',
    customerPhone: '+1 (555) 246-8135',
    item: 'Prada PR 17WS',
    waitingFor: 'Rx Verification',
    currentStatus: 'Pending',
    timeElapsed: '45m',
    statusColor: 'bg-neutral-100 text-neutral-700',
    isNextActive: true,
    isApproved: true,
    customerId: 'CUST-004'
  }
]

export default function SaleStaffPrescriptionPage() {
  const navigate = useNavigate()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleOpenDrawer = (id: string, order?: any) => {
    setSelectedOrderId(id)
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleReviewRx = (id: string) => {
    navigate(PATHS.SALESTAFF.VERIFY_RX(id))
  }

  const handleViewFullDetails = () => {
    if (selectedOrderId) {
      navigate(PATHS.SALESTAFF.VERIFY_RX(selectedOrderId))
      setIsDrawerOpen(false)
    }
  }

  const handleNotifyCustomer = (customerId: string) => {
    navigate(`${PATHS.SALESTAFF.CUSTOMERS}?customerId=${customerId}`)
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
          <span className="text-primary-500 font-semibold">Prescription Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Prescription Orders</h1>
        <p className="text-gray-500 mt-1">Manage technical lens details and fabrication status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Pending Lab
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">12</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
              <IoFlaskOutline size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                In Grinding
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">8</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <IoSync size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Ready for QA
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">5</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <IoCheckboxOutline size={20} />
            </div>
          </div>
        </Card>
        <Card className="p-5 border border-neutral-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Completed Today
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">24</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <IoCheckmarkDoneCircleOutline size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex-1 max-w-xl w-full"></div>
        <div className="flex gap-3 justify-end w-full md:w-auto">
          <Button
            variant="outline"
            colorScheme="neutral"
            leftIcon={<IoFilter />}
            className="rounded-xl font-semibold"
          >
            Filter
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            leftIcon={<IoAdd />}
            className="rounded-xl font-semibold"
          >
            New Order
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
        <OrderTable
          role="sales"
          orders={MOCK_PRESCRIPTION_ORDERS}
          onRowClick={handleOpenDrawer}
          onReviewRx={handleReviewRx}
          onNotifyCustomer={handleNotifyCustomer}
        />
      </Card>

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        orderType="Prescription"
        isApproved={selectedOrder?.isApproved}
        onViewFullDetails={handleViewFullDetails}
        onNotifyCustomer={handleNotifyCustomer}
      />
    </Container>
  )
}
