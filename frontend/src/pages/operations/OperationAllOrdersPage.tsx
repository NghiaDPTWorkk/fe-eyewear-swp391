import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { useOrderCountStore } from '@/store'
import type { Order } from '@/features/staff/components/OrderTable/OrderTable'
import { OrderType } from '@/shared/utils/enums/order.enum'

export default function OperationAllOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'

  const setFilter = (value: string) => {
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: value })
    }
  }

  // Lấy orders, isLoading, isError từ Zustand store (đã được fetch ở OperationLayout)
  const { orders, isLoading, isError } = useOrderCountStore()

  const allCount = orders.length
  const preOrderCount = orders.filter((o: Order) => o.orderType === OrderType.PRE_ORDER).length
  const normalCount = orders.filter((o: Order) => o.orderType === OrderType.NORMAL).length
  const prescriptionCount = orders.filter(
    (o: Order) => o.orderType === OrderType.MANUFACTURING
  ).length

  const filterButtons = [
    { label: 'All', count: allCount, value: 'all' },
    { label: 'Pre-order', count: preOrderCount, value: OrderType.PRE_ORDER }, // 'PRE-ORDER'
    { label: 'Normal', count: normalCount, value: OrderType.NORMAL }, // 'NORMAL'
    { label: 'Manufacturing', count: prescriptionCount, value: OrderType.MANUFACTURING } // 'MANUFACTURING'
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

      {/* Truyền orders, isLoading, isError xuống OrderTable để xử lý render states */}
      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['WAITING FOR','CUSTOMER']}
        filterType={filter === 'all' ? undefined : filter}
        role="operation"
      />
    </Container>
  )
}
