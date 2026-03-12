import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BreadcrumbPath, Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { useOrders } from '@/features/staff/hooks/orders/useOrders'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { OrderType, OrderStatus } from '@/shared/utils/enums/order.enum'
import { useOrderCountStore } from '@/store'
import { transformApiOrderToTableOrder } from '@/features/staff/components/order-table/orderTransformers'

const PAGE_LIMIT = 10

export default function OperationTechnicalPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const typeFilter = searchParams.get('type') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)

  const setTypeFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ type: value })
    }
  }

  // Fetch orders với status MAKING và typeFilter từ API — có phân trang
  const { data, isLoading, isError } = useOrders(
    currentPage,
    PAGE_LIMIT,
    OrderStatus.MAKING,
    typeFilter === 'all' ? undefined : typeFilter
  )

  // Lấy dữ liệu từ store để tính counts cho badges
  const { orders: allOrdersForCounts } = useOrderCountStore()

  // Lọc lấy danh sách đơn đang ở trạng thái MAKING
  const technicalOrdersInStore = useMemo(() => {
    return allOrdersForCounts.filter((o) => o.currentStatus === OrderStatus.MAKING)
  }, [allOrdersForCounts])

  // Badge counts cho filter buttons
  const counts = {
    all: technicalOrdersInStore.length,
    preOrder: technicalOrdersInStore.filter((o) => o.orderType === OrderType.PRE_ORDER).length,
    manufacturing: technicalOrdersInStore.filter((o) => o.orderType === OrderType.MANUFACTURING)
      .length
  }

  const filterButtons = [
    { label: 'All', count: counts.all, value: 'all' },
    { label: 'Pre-order', count: counts.preOrder, value: OrderType.PRE_ORDER },
    { label: 'Manufacturing', count: counts.manufacturing, value: OrderType.MANUFACTURING }
  ]

  // Pagination meta từ BE
  const paginationMeta = data?.data?.orders

  // Transform data từ API sang format của OrderTable
  const orders = useMemo(() => {
    if (!paginationMeta?.data) return []
    return paginationMeta.data.map(transformApiOrderToTableOrder)
  }, [paginationMeta])

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'Technical Station']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Technical Station</h1>
        <p className="text-gray-500 mt-1">Maintenance and technical support for optical equipment.</p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={typeFilter}
        onChange={setTypeFilter}
        className="mb-4"
      />

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        isError={isError}
        hiddenColumns={['CUSTOMER']}
        role="operation"
      />

      {paginationMeta && orders.length > 0 && (
        <OperationPagination
          page={paginationMeta.page}
          totalPages={paginationMeta.totalPages}
          total={paginationMeta.total}
          limit={paginationMeta.limit}
          itemsOnPage={orders.length}
          onPageChange={setCurrentPage}
        />
      )}
    </Container>
  )
}
