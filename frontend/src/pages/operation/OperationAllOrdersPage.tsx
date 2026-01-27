import { useState } from 'react'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'

export default function OperationAllOrdersPage() {
  const [filter, setFilter] = useState('all')

  const filterButtons = [
    { label: 'Tất cả', count: 5, value: 'all' },
    { label: 'Pre-order', count: 2, value: 'Pre-order' },
    { label: 'Đơn Thường', count: 2, value: 'Đơn Thường' },
    { label: 'Prescription', count: 1, value: 'Prescription' }
  ]

  return (
    <Container>
      <div className="text-sm text-gray-600 mb-2">Order Management / All Orders</div>
      <h1 className="text-xl font-semibold mb-5 text-primary-700">All Orders</h1>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={setFilter}
        className="mb-4"
      />

      <OrderTable
        hiddenColumns={['WAITING FOR']}
        filterType={filter === 'all' ? undefined : filter}
      />
    </Container>
  )
}
