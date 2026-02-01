import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { SalesStaffOrderList } from '@/features/sales/components/SalesStaffOrderList'
import { SalesStaffVerifyModal } from '@/features/sales/components/SalesStaffVerifyModal'
import { SalesStaffBreadcrumb } from '@/features/sales/components/SalesStaffBreadcrumb'
import { SalesStaffControls } from '@/features/sales/components/SalesStaffControls'
import { SalesStaffPagination } from '@/features/sales/components/SalesStaffPagination'
import type { LensParameter, Order } from '@/features/sales/types'

export default function SaleStaffOrderPage() {
  const [searchParams] = useSearchParams()
  const invoiceIdParam = searchParams.get('invoiceId')
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const { verifyOrder, rejectOrder, processing } = useSalesStaffAction()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
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
    if (selectedOrder && (await verifyOrder(selectedOrder.id, params))) {
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
      <SalesStaffBreadcrumb />

      <SalesStaffControls
        onSearch={setSearch}
        onFilterChange={setFilter}
        currentFilter={filter}
        onExport={() => alert('Exporting...')}
        onCreateOrder={() => alert('Create new order')}
      />

      <SalesStaffOrderList
        orders={filteredOrders}
        loading={loading}
        onVerify={(order) => {
          setSelectedOrder(order)
          setIsModalOpen(true)
        }}
        onReject={handleRejectClick}
        onViewDetail={(order) => console.log('Detail', order.id)}
      />

      <SalesStaffPagination total={filteredOrders.length} currentPage={1} pageSize={10} />

      <SalesStaffVerifyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleVerifySubmit}
        isProcessing={processing}
      />
    </Container>
  )
}
