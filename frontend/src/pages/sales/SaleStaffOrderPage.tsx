import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { OrderManagementList } from '@/features/sales/components/OrderManagementList'
import { OrderVerifyModal } from '@/features/sales/components/OrderVerifyModal'
import { OrderBreadcrumb } from '@/features/sales/components/OrderBreadcrumb'
import { OrderControls } from '@/features/sales/components/OrderControls'
import { OrderPagination } from '@/features/sales/components/OrderPagination'
import type { LensParameter, Order } from '@/features/sales/types'

export default function SaleStaffOrderPage() {
  const [searchParams] = useSearchParams()
  const invoiceIdParam = searchParams.get('invoiceId')
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const { verifyOrder, rejectOrder, processing } = useSalesStaffAction()

  const [SelectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchInvoice =
        !invoiceIdParam ||
        String(order.invoiceId) === invoiceIdParam ||
        order.invoice?.id === invoiceIdParam
      const matchSearch =
        order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(search.toLowerCase())
      const matchFilter =
        filter === 'All' ||
        (filter === 'Pending' && order.isPrescription && order.status === 'WAITING_ASSIGN') ||
        (filter === 'Processed' && (!order.isPrescription || order.status !== 'WAITING_ASSIGN'))
      return matchInvoice && matchSearch && matchFilter
    })
  }, [orders, search, filter, invoiceIdParam])

  const handleVerifySubmit = async (params: LensParameter) => {
    if (SelectedOrder && (await verifyOrder(SelectedOrder.id, params))) {
      setIsModalOpen(false)
      fetchOrders()
    }
  }

  const handleRejectClick = async (order: Order) => {
    if (order.invoiceId && window.confirm('Reject this order? This will cancel the Invoice.')) {
      if (await rejectOrder(order.invoiceId)) fetchOrders()
    }
  }

  return (
    <Container>
      <OrderBreadcrumb />

      <OrderControls
        onSearch={setSearch}
        onFilterChange={setFilter}
        currentFilter={filter}
        onExport={() => alert('Exporting...')}
        onCreateOrder={() => alert('Create new order')}
      />

      <OrderManagementList
        orders={filteredOrders}
        loading={loading}
        onVerify={(order) => {
          setSelectedOrder(order)
          setIsModalOpen(true)
        }}
        onReject={handleRejectClick}
        onViewDetail={(order) => console.log('Detail', order.id)}
      />

      <OrderPagination total={filteredOrders.length} currentPage={1} pageSize={10} />

      <OrderVerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVerifySubmit}
        isProcessing={processing}
      />
    </Container>
  )
}
