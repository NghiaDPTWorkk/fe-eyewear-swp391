import { useState } from 'react'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'

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

      <OrderTable
        hiddenColumns={['WAITING FOR']}
        filterType={filter === 'all' ? undefined : filter}
        role="operation"
      />
    </Container>
  )
}
