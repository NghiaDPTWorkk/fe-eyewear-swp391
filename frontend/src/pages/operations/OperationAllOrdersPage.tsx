import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { Pagination } from '@/shared/components/ui/pagination'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'
import type { Product } from '@/shared/types'

const ITEMS_PER_PAGE = 5

// Product is a union type, so we checks to access properties that might differ between types (e.g., 'id' vs '_id')
function mapProductToOrder(product: Product, typeOverride?: string) {
  const productId = 'id' in product ? product.id : product._id
  
  return {
    // Handle both 'id' (StandardProduct) and '_id' (BaseProduct)
    id: productId || product.skuBase,
    orderType:
      typeOverride ||
      (product.type === 'sunglass'
        ? 'Sunglass'
        : product.type === 'frame'
          ? 'Frame'
          : 'Lens'),
    customer: 'Customer',
    item: product.nameBase,
    waitingFor: '-',
    currentStatus: 'Processing',
    timeElapsed: '2h',
    statusColor: 'bg-blue-100 text-blue-600',
    isNextActive: true
  }
}

function AllOrdersView() {
  const [currentPage, setCurrentPage] = useState(1)
  const { products, total, totalPages } = useGetProductWithPagination(currentPage, ITEMS_PER_PAGE)

  const mappedOrders = products.map(p => mapProductToOrder(p))

  return (
    <>
      <OrderTable
        hiddenColumns={['WAITING FOR']}
        role="operation"
        orders={mappedOrders}
      />
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}

function TypedOrdersView({ type }: { type: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  // Determine if we need to reset page when type changes?
  // Ideally yes, but useState init only runs once.
  // Passing key={type} to this component in parent ensures it remounts and resets state.

  const { products, total, totalPages } = useGetProductWithType(currentPage, ITEMS_PER_PAGE, type)

  const mappedOrders = products.map(p => mapProductToOrder(p , type))

  return (
    <>
      <OrderTable
        hiddenColumns={['WAITING FOR']}
        filterType={type}
        role="operation"
        orders={mappedOrders}
      />
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}

export default function OperationAllOrdersPage() {
  const [filter, setFilter] = useState('all')

  const filterButtons = [
    { label: 'All', count: 5, value: 'all' },
    { label: 'Pre-order', count: 2, value: 'Pre-order' },
    { label: 'Normal', count: 2, value: 'Đơn Thường' },
    { label: 'Prescription', count: 1, value: 'Prescription' }
  ]

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/operationstaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">All Orders</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
        <p className="text-gray-500 mt-1">Manage the entire database of orders in the system.</p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={setFilter}
        className="mb-6"
      />

      {filter === 'all' ? (
        <AllOrdersView />
      ) : (
        <TypedOrdersView key={filter} type={filter} />
      )}
    </Container>
  )
}
