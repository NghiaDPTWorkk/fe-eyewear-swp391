import { useState } from 'react'
import { Container, Button } from '@/components'
import { Card } from '@/components/atoms/card'
import OrderTable from '@/components/staff/ordertable/OrderTable'
import {
  IoSearchOutline,
  IoFilter,
  IoCloudDownloadOutline,
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import FilterButtonList from '@/components/staff/filterbuttonlist/FilterButtonList'

export default function SaleStaffOrderPage() {
  const [filter, setFilter] = useState('All Orders')

  const filterButtons = [
    { label: 'All Orders', count: 128, value: 'All Orders' },
    { label: 'Pending', count: 12, value: 'Pending' },
    { label: 'In Lab', count: 8, value: 'In Lab' },
    { label: 'Ready for Pickup', count: 4, value: 'Ready for Pickup' },
    { label: 'Completed', count: 0, value: 'Completed' }
  ]

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <a
            href="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </a>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-bold">Order Management</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order List</h1>
      </div>

      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-xl w-full">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-neutral-400"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              colorScheme="neutral"
              leftIcon={<IoFilter className="text-lg" />}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              colorScheme="neutral"
              leftIcon={<IoCloudDownloadOutline className="text-lg" />}
            >
              Export
            </Button>
            <Button variant="solid" colorScheme="primary" leftIcon={<IoAdd className="text-lg" />}>
              Create New Order
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <FilterButtonList
          buttons={filterButtons}
          selectedValue={filter}
          onChange={setFilter}
          className="mb-4"
        />

        {/* Table Card */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <OrderTable />
        </Card>

        {/* Pagination placeholder (OrderTable might handle it or we add below) */}
        <div className="flex items-center justify-between px-2 text-sm text-gray-500">
          <span>Showing 1-5 of 128 orders</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-neutral-200"
            >
              <IoChevronBackOutline />
            </Button>
            <Button
              variant="solid"
              colorScheme="primary"
              size="sm"
              className="min-w-[32px] px-2 font-bold"
            >
              1
            </Button>
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="min-w-[32px] px-2 text-neutral-400 border-neutral-100"
            >
              2
            </Button>
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="min-w-[32px] px-2 text-neutral-400 border-neutral-100"
            >
              3
            </Button>
            <span className="px-1 text-neutral-300">...</span>
            <Button
              variant="outline"
              colorScheme="neutral"
              size="sm"
              className="px-2 border-neutral-200"
            >
              <IoChevronForwardOutline />
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}
