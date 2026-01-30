import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { cn } from '@/lib/utils'
import { Container, Button, Card } from '@/components'
import SaleStaffOrderTable, {
  type Order
} from '@/features/sales/components/SaleStaffOrderTable/SaleStaffOrderTable'
import SaleStaffOrderDetailsDrawer from '@/features/sales/components/SaleStaffOrderDetailsDrawer/SaleStaffOrderDetailsDrawer'
import {
  IoSearchOutline,
  IoFilter,
  IoCloudDownloadOutline,
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'

export default function SaleStaffOrderPage() {
  const [filter, setFilter] = useState('All')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleOpenDrawer = (id: string, order?: Order) => {
    if (order?.orderType === 'Prescription') {
      setSelectedOrderId(id)
      setSelectedOrder(order)
      setIsDrawerOpen(true)
    } else if (order?.orderType === 'Pre-order') {
      navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(id))
    } else {
      navigate(PATHS.SALESTAFF.REGULAR_DETAIL(id))
    }
  }

  const handleViewFullDetails = () => {
    if (selectedOrderId && selectedOrder) {
      if (selectedOrder.orderType === 'Prescription') {
        navigate(PATHS.SALESTAFF.VERIFY_RX(selectedOrderId))
      } else if (selectedOrder.orderType === 'Pre-order') {
        navigate(PATHS.SALESTAFF.PRE_ORDER_DETAIL(selectedOrderId))
      } else {
        navigate(PATHS.SALESTAFF.REGULAR_DETAIL(selectedOrderId))
      }
      setIsDrawerOpen(false)
    }
  }

  const navigate = useNavigate()

  const filterOptions = [
    { label: 'All Orders', value: 'All' },
    { label: 'Prescription', value: 'Prescription' },
    { label: 'Pre-order', value: 'Pre-order' },
    { label: 'Regular', value: 'Regular' }
  ]

  const currentFilterLabel = filterOptions.find((opt) => opt.value === filter)?.label || filter

  if (!filterOptions.find((opt) => opt.value === filter)) {
    // Fallback or handle error
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-2 font-medium">
          <Link
            to="/salestaff/dashboard"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Order Management</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Order List</h1>
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

          <div className="flex gap-3 w-full md:w-auto relative">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-all min-w-[160px] justify-between h-[42px]',
                  isFilterOpen
                    ? 'bg-primary-50 border-primary-500 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-2">
                  <IoFilter /> Filter: {currentFilterLabel}
                </div>
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <Card className="absolute top-full mt-2 right-0 w-56 z-20 p-2 shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left',
                            filter === opt.value
                              ? 'bg-primary-50 text-primary-600 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                          onClick={() => {
                            setFilter(opt.value)
                            setIsFilterOpen(false)
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Card>
                </>
              )}
            </div>
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

        {/* Table Card */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <SaleStaffOrderTable
            onRowClick={handleOpenDrawer}
            filterType={filter === 'All' ? undefined : filter}
          />
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
              className="min-w-[32px] px-2 font-semibold"
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

      <SaleStaffOrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        orderType={selectedOrder?.orderType}
        isApproved={selectedOrder?.isApproved}
        onViewFullDetails={handleViewFullDetails}
      />
    </Container>
  )
}
