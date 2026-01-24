import { useState } from 'react'
import { Container } from '@/components'
import OrderTable from '@/components/staff/ordertable/OrderTable'
import FilterButtonList from '@/components/staff/filterbuttonlist/FilterButtonList'

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
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
          <a href="/operationstaff/dashboard" className="hover:text-mint-600 transition-colors">
            Dashboard
          </a>
          <span>/</span>
          <span className="text-mint-600 font-bold">All Orders</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track all customer orders in one place.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <FilterButtonList buttons={filterButtons} selectedValue={filter} onChange={setFilter} />
        </div>

        <div className="p-0">
          <OrderTable
            hiddenColumns={['WAITING FOR']}
            filterType={filter === 'all' ? undefined : filter}
          />
        </div>
      </div>
    </Container>
  )
}
