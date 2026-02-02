import { useState, useEffect, useMemo } from 'react'
import { Container, Card } from '@/components'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { OrderFilterBar } from '@/features/sales/components/orders/OrderFilterBar'
import { SalesStaffRxTable } from '@/features/sales/components/prescriptions/RxTable'
import SalesStaffRxMetrics from '@/features/sales/components/prescriptions/RxMetrics'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { toast } from 'react-hot-toast'
import PageHeader from '@/features/sales/components/common/PageHeader'
import type { Order } from '@/features/sales/types'

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

  const handleReject = async (order: Order) => {
    if (window.confirm('Reject this order?') && (await rejectOrder(order._id))) {
      toast.success('Rejected')
      fetchOrders()
    }
  }

  return (
    <Container>
      <PageHeader
        title="Prescription Orders"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Prescriptions' }
        ]}
      />
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
          onVerify={(o: Order) => {
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
