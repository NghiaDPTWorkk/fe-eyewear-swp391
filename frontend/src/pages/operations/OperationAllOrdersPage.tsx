import { useState } from 'react'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrderCountStore } from '@/store'
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'

export default function OperationAllOrdersPage() {
  const [filter, setFilter] = useState('all')

  const { orders } = useOrderCountStore()

  // Tính filter counts từ real data
  const allCount = orders.length
  const preOrderCount = orders.filter((o: Order) => o.orderType === 'Pre-order').length
  const normalCount = orders.filter((o: Order) => o.orderType === 'Đơn Thường').length
  const prescriptionCount = orders.filter((o: Order) => o.orderType === 'Manufacturing').length
  // ========== END NEW CODE ==========

  const filterButtons = [
    { label: 'All', count: allCount, value: 'all' },
    { label: 'Pre-order', count: preOrderCount, value: 'Pre-order' },
    { label: 'Normal', count: normalCount, value: 'Đơn Thường' },
    { label: 'Prescription', count: prescriptionCount, value: 'Manufacturing' }
  ]

  return (
    <Container>
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'All Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
        <p className="text-gray-500 mt-1">Manage the entire database of orders in the system.</p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={setFilter}
        className="mb-6"
      />

      {/* ========== START NEW CODE ========== */}
      <OrderTable
        orders={orders}
        hiddenColumns={['WAITING FOR']}
        filterType={filter === 'all' ? undefined : filter}
        role="operation"
      />
      {/* ========== END NEW CODE ========== */}
    </Container>
  )
}
