import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable } from '@/components/staff'
import { Pagination } from '@/shared/components/ui/pagination'
import { useGetProductWithType } from '@/shared/hooks/products/useGetProductWithType'

export default function OperationPrescriptionPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const { products, total, totalPages, loading, refetch } = useGetProductWithType(currentPage, itemsPerPage, 'Prescription')

  const mappedOrders = products.map((product: any) => ({
    id: product.id || product._id || product.skuBase,
    orderType: 'Prescription',
    customer: 'Khách hàng',
    item: product.nameBase,
    waitingFor: '-',
    currentStatus: 'Pending',
    timeElapsed: '45m',
    statusColor: 'bg-indigo-50 text-indigo-600',
    isNextActive: true 
  }))

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
          <span className="text-primary-500 font-bold">Technical</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Prescription Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage technical specifications and lens processing status.
        </p>
      </div>

      <OrderTable 
        hiddenColumns={['WAITING FOR']} 
        filterType="Prescription" 
        role="operation" 
        orders={mappedOrders}
      />

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
