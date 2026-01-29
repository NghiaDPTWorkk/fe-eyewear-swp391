import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { Pagination } from '@/shared/components/ui/pagination'
import { useGetProductWithPagination } from '@/shared/hooks/products/useGetProductWithPagination'
import type { Product } from '@/shared/types'

export default function OperationPackingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { products, total, totalPages } = useGetProductWithPagination(currentPage, itemsPerPage)

  // Use Product union type with type guard
  const mappedOrders = products.map((product: Product) => {
    const productId = 'id' in product ? product.id : product._id

    return {
      id: productId || product.skuBase,
      orderType:
        product.type === 'sunglass' ? 'Kính mát' : product.type === 'frame' ? 'Frame' : 'Lens',
      customer: 'Khách hàng',
      item: product.nameBase,
      waitingFor: '-',
      currentStatus: 'Packing',
      timeElapsed: '1h 30m',
      statusColor: 'bg-purple-100 text-purple-600',
      isNextActive: true
    }
  })

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
          <span className="text-primary-500 font-bold">Packing Station</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Packing Station</h1>
      </div>

      <OrderTable hiddenColumns={['WAITING FOR']} orders={mappedOrders} />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  )
}
