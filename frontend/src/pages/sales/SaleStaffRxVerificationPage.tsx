import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import { SalesStaffRxTable } from '@/features/sales/components/prescription/SalesStaffRxTable'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import {
  IoFilter,
  IoAdd,
  IoFlaskOutline,
  IoSync,
  IoCheckboxOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5'
import type { Order } from '@/features/sales/types'
import { toast } from 'react-hot-toast'

export default function SaleStaffRxVerificationPage() {
  const { rxOrders, loading, fetchOrders } = useSalesStaffOrders()
  const { rejectOrder } = useSalesStaffAction()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [filter] = useState('All')

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const flattenedOrders = useMemo(() => rxOrders, [rxOrders])

  // Calculate metrics
  const metrics = useMemo(() => {
    return {
      pending: flattenedOrders.filter((o) => o.status === 'WAITING_ASSIGN').length,
      grinding: flattenedOrders.filter((o) => o.status === 'PROCESSING').length,
      readyQA: flattenedOrders.filter((o) => o.status === 'VERIFIED').length,
      completed: flattenedOrders.filter((o) => o.status === 'COMPLETED').length
    }
  }, [flattenedOrders])

  const filteredOrders = useMemo(() => {
    // Basic filter logic matching our previous implementation
    return flattenedOrders.filter((o) => filter === 'All' || o.status === filter)
  }, [flattenedOrders, filter])

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrderId(order._id)
    setIsDrawerOpen(true)
  }

  const handleReject = async (order: Order) => {
    if (window.confirm('Reject this order?')) {
      if (await rejectOrder(order._id)) {
        toast.success('Rejected')
        fetchOrders()
      } else toast.error('Rejection failed')
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
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">{metrics.pending}</h3>
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
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">{metrics.grinding}</h3>
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
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">{metrics.readyQA}</h3>
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
                Completed
              </p>
              <h3 className="text-3xl font-semibold text-neutral-900 mt-2">{metrics.completed}</h3>
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

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm rounded-xl">
        <SalesStaffRxTable
          orders={filteredOrders}
          loading={loading}
          onVerify={handleOpenDrawer}
          onReject={handleReject}
        />
      </Card>

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onUpdate={() => {
          fetchOrders()
        }}
      />
    </Container>
  )
}
