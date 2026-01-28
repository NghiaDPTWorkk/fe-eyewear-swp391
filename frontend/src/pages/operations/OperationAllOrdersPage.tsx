import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components'
import { OrderTable, FilterButtonList } from '@/components/staff'

export default function OperationAllOrdersPage() {
  const [filter, setFilter] = useState('all')

  const filterButtons = [
    { label: 'All', count: 5, value: 'all' },
    { label: 'Pre-order', count: 2, value: 'Pre-order' },
    { label: 'Regular', count: 2, value: 'Regular' },
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

      <OrderTable
        hiddenColumns={['WAITING FOR']}
        filterType={filter === 'all' ? undefined : filter}
        role="operation"
      />
    </Container>
  )
}
