import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components'
import { FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operation-staff/breadcrumb-path'
import { useOrderCountStore } from '@/store'
import { OrderType } from '@/shared/utils/enums/order.enum'
import { OperationPagination } from '@/shared/components/ui/pagination'
import { OrderTable, type Column } from '@/shared/components/staff/staff-core/order-table'
import { cn } from '@/lib/utils'

export default function OperationAllOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)
  const { orders, isLoading } = useOrderCountStore()

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o: any) => o.orderType === filter)
  const total = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(total / 10))
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * 10, currentPage * 10)

  const filterButtons = [
    { label: 'All', count: orders.length, value: 'all' },
    {
      label: 'Pre-order',
      count: orders.filter((o: any) => o.orderType === OrderType.PRE_ORDER).length,
      value: OrderType.PRE_ORDER
    },
    {
      label: 'Normal',
      count: orders.filter((o: any) => o.orderType === OrderType.NORMAL).length,
      value: OrderType.NORMAL
    },
    {
      label: 'Manufacturing',
      count: orders.filter((o: any) => o.orderType === OrderType.MANUFACTURING).length,
      value: OrderType.MANUFACTURING
    }
  ]

  const columns: Column<any>[] = [
    {
      header: 'Order Code',
      render: (o) => <span className="font-bold text-slate-900">{o.orderCode || o.id}</span>
    },
    {
      header: 'Type',
      render: (o) => (
        <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase">
          {o.orderType}
        </span>
      )
    },
    { header: 'Item', render: (o) => <span className="text-slate-600">{o.item}</span> },
    {
      header: 'Status',
      render: (o) => (
        <span
          className={cn(
            'px-3 py-1 rounded-full text-[10px] font-bold uppercase border',
            o.statusColor
          )}
        >
          {o.currentStatus}
        </span>
      )
    },
    {
      header: 'Time',
      render: (o) => <span className="text-slate-400 font-medium">{o.timeElapsed}</span>
    },
    {
      header: 'Price',
      render: (o) => <span className="font-semibold text-slate-700">{o.price} đ</span>
    }
  ]

  return (
    <Container>
      <div className="mb-4">
        <BreadcrumbPath paths={['Dashboard', 'All Orders']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
        <p className="text-gray-500 mt-1">Manage the entire database of orders in the system.</p>
      </div>
      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={(v) => {
          setCurrentPage(1)
          if (v === 'all') setSearchParams({})
          else setSearchParams({ filter: v })
        }}
        className="mb-6"
      />
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
        <OrderTable
          data={paginatedOrders}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No orders found."
        />
        <OperationPagination
          page={currentPage}
          totalPages={totalPages}
          total={total}
          limit={10}
          itemsOnPage={paginatedOrders.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </Container>
  )
}
