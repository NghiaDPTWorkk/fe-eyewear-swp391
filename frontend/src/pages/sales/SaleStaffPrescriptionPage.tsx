import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Card } from '@/components'
import { SalesStaffRxTable } from '@/features/sales/components/prescription/SalesStaffRxTable'
import { SalesStaffRxMetrics } from '@/features/sales/components/prescription/SalesStaffRxMetrics'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { OrderFilterBar } from '@/features/sales/components/orders/OrderFilterBar'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { toast } from 'react-hot-toast'

export default function SaleStaffPrescriptionPage() {
  const { rxOrders, loading, fetchOrders } = useSalesStaffOrders()
  const { rejectOrder } = useSalesStaffAction()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState('All'),
    [search, setSearch] = useState(''),
    [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(
    () =>
      rxOrders.filter(
        (o) =>
          ((o._id || '').toString().toLowerCase().includes(search.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            o.orderCode?.toLowerCase().includes(search.toLowerCase())) &&
          (filter === 'All' ||
            (filter === 'WAITING_ASSIGN' &&
              (o.status === 'WAITING_ASSIGN' ||
                o.status === 'DEPOSITED' ||
                o.status === 'PENDING')) ||
            o.status === filter)
      ),
    [rxOrders, search, filter]
  )

  const handleReject = async (order: any) => {
    if (window.confirm('Reject this order?') && (await rejectOrder(order._id))) {
      toast.success('Rejected')
      fetchOrders()
    }
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link to="/salestaff/dashboard" className="text-neutral-400 hover:text-primary-500">
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Prescriptions</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Prescription Orders</h1>
      </div>
      <SalesStaffRxMetrics />
      <OrderFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterOptions={[
          { label: 'All Orders', value: 'All' },
          { label: 'Waiting Verify', value: 'WAITING_ASSIGN' },
          { label: 'Processing', value: 'PROCESSING' }
        ]}
        placeholder="Search prescriptions..."
        onAdd={() => {}}
      />
      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm rounded-xl">
        <SalesStaffRxTable
          orders={filteredOrders}
          loading={loading}
          onVerify={(o) => {
            setSelectedOrderId(o._id)
            setIsDrawerOpen(true)
          }}
          onReject={handleReject}
        />
      </Card>
      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onUpdate={fetchOrders}
      />
    </Container>
  )
}
