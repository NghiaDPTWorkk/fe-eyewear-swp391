import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Container, Card, Button } from '@/components'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { SalesStaffOrderList } from '@/features/sales/components/SalesStaffOrderList'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { OrderFilterBar } from '@/features/sales/components/orders/OrderFilterBar'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

export default function SaleStaffOrderPage() {
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const invoiceIdParam = searchParams.get('invoiceId')
  const orderIdParam = searchParams.get('orderId')

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orderIdParam)
  const [isDrawerOpen, setIsDrawerOpen] = useState(!!orderIdParam)
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          (invoiceIdParam ? o.invoiceId === invoiceIdParam : true) &&
          ((o._id || '').toString().toLowerCase().includes(search.toLowerCase()) ||
            o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            o.orderCode?.toLowerCase().includes(search.toLowerCase())) &&
          (typeFilter === 'All' ||
            (typeFilter === 'Prescription' &&
              (o.type?.includes('MANUFACTURING') || o.isPrescription)) ||
            (typeFilter === 'Pre-order' && o.type?.includes('PRE-ORDER')) ||
            (typeFilter === 'Regular' &&
              !o.type?.includes('MANUFACTURING') &&
              !o.type?.includes('PRE-ORDER') &&
              !o.isPrescription))
      ),
    [orders, search, typeFilter, invoiceIdParam]
  )

  const handleOpenDrawer = (o: any) => {
    setSelectedOrderId(o._id)
    setIsDrawerOpen(true)
  }

  const handleVerify = (order: any) => {
    navigate(`/salestaff/orders/${order._id || order.id}/verify-rx`)
  }

  const handleChat = (order: any) => {
    const customerId = order.customerId || order.invoiceId
    console.log('Opening chat with customer:', customerId)
    alert(`Chat with ${order.customerName} (ID: ${customerId})`)
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
          <span className="text-primary-500 font-semibold">Order Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Order List</h1>
      </div>

      <OrderFilterBar
        search={search}
        setSearch={setSearch}
        filter={typeFilter}
        setFilter={setTypeFilter}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filterOptions={[
          { label: 'All Orders', value: 'All' },
          { label: 'Prescription', value: 'Prescription' },
          { label: 'Pre-order', value: 'Pre-order' },
          { label: 'Regular', value: 'Regular' }
        ]}
        placeholder="Search by Order ID, Customer Name..."
        onExport={() => {}}
        onAdd={() => {}}
      />

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm bg-white rounded-xl mt-6">
        <SalesStaffOrderList
          orders={filteredOrders}
          loading={loading}
          onVerify={handleVerify}
          onViewDetail={handleOpenDrawer}
          onChat={handleChat}
        />
      </Card>

      <div className="flex items-center justify-between px-2 text-sm text-gray-500 mt-6 bottom-0">
        <span>
          Showing 1-{filteredOrders.length} of {orders.length} orders
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
      />
    </Container>
  )
}
