import { useState, useEffect, useMemo } from 'react'
import { Container, Card } from '@/components'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import { OrderFilterBar } from '@/features/sales/components/orders/OrderFilterBar'
import { SalesStaffRxTable } from '@/features/sales/components/prescriptions/RxTable'
import SalesStaffRxMetrics from '@/features/sales/components/prescriptions/RxMetrics'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import PageHeader from '@/features/sales/components/common/PageHeader'
import { isOrderVerified } from '@/features/sales/utils/orderUtils'
import type { Order } from '@/features/sales/types'
import { useDebounce } from '@/shared/hooks'

export default function SaleStaffPrescriptionPage() {
  // Limit to 15 prescription orders per load for better performance
  const { rxOrders, loading, fetchOrders } = useSalesStaffOrders(1, 15)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(
    () =>
      rxOrders.filter((o) => {
        const matchesSearch =
          (o._id || '').toString().toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          o.customerName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          o.orderCode?.toLowerCase().includes(debouncedSearch.toLowerCase())

        const isVerified = isOrderVerified(o)

        const matchesFilter =
          filter === 'All' ||
          (filter === 'NEED_VERIFY' && !isVerified) ||
          (filter === 'VERIFIED' && isVerified) ||
          (filter === 'PROCESSING' && o.status === 'PROCESSING')

        return matchesSearch && matchesFilter
      }),
    [rxOrders, debouncedSearch, filter]
  )

  return (
    <Container className="pt-2 pb-8 px-2 max-w-none">
      <PageHeader
        title="Prescription Orders"
        breadcrumbs={[
          { label: 'Dashboard', path: '/salestaff/dashboard' },
          { label: 'Orders', path: '/salestaff/orders' },
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
          { label: 'Need Verify', value: 'NEED_VERIFY' },
          { label: 'Verified', value: 'VERIFIED' },
          { label: 'Processing', value: 'PROCESSING' }
        ]}
        placeholder="Search by Order Code, Customer Name..."
        onAdd={() => {}}
      />
      <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm rounded-xl">
        <SalesStaffRxTable
          orders={filteredOrders}
          loading={loading}
          onVerify={(o: Order) => {
            setSelectedOrderId(o._id)
            setIsDrawerOpen(true)
          }}
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
