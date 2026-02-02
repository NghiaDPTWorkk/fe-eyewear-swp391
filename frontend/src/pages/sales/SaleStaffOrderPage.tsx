import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card } from '@/components'
import { cn } from '@/lib/utils'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { SalesStaffOrderList } from '@/features/sales/components/SalesStaffOrderList'
import { OrderDetailsDrawer } from '@/features/sales/components/orders/OrderDetailsDrawer'
import {
  IoSearchOutline,
  IoFilter,
  IoCloudDownloadOutline,
  IoAdd,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from 'react-icons/io5'
import type { Order } from '@/features/sales/types'

export default function SaleStaffOrderPage() {
  const { orders, loading, fetchOrders } = useSalesStaffOrders()
  const { rejectOrder } = useSalesStaffAction()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        (order._id || '').toString().toLowerCase().includes(search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderCode?.toLowerCase().includes(search.toLowerCase())

      // Update filter mapping to match the 4 options: All, Prescription, Pre-order, Regular
      const matchType =
        typeFilter === 'All' ||
        (typeFilter === 'MANUFACTURING' && order.type?.includes('MANUFACTURING')) ||
        (typeFilter === 'PRE-ORDER' && order.type?.includes('PRE-ORDER')) ||
        (typeFilter === 'STANDARD' && order.type?.includes('STANDARD'))

      return matchSearch && matchType
    })
  }, [orders, search, typeFilter])

  const handleOpenDrawer = (order: Order) => {
    setSelectedOrderId(order._id)
    setIsDrawerOpen(true)
  }

  const handleChat = (order: Order) => {
    alert(`Opening chat with ${order.customerName || 'Customer'} (Ref: ${order.orderCode})`)
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <IoFilter /> Filter: {typeFilter === 'All' ? 'All Orders' : typeFilter}
                </div>
              </button>

              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                  <Card className="absolute top-full mt-2 right-0 w-56 z-20 p-2 shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      {[
                        { label: 'All Orders', value: 'All' },
                        { label: 'Prescription', value: 'MANUFACTURING' },
                        { label: 'Pre-order', value: 'PRE-ORDER' },
                        { label: 'Regular', value: 'STANDARD' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left',
                            typeFilter === opt.value
                              ? 'bg-primary-50 text-primary-600 font-semibold'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                          onClick={() => {
                            setTypeFilter(opt.value)
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
              onClick={() => alert('Exporting...')}
            >
              Export
            </Button>
            <Button
              variant="solid"
              colorScheme="primary"
              leftIcon={<IoAdd className="text-lg" />}
              onClick={() => alert('Create new order')}
            >
              Create New Order
            </Button>
          </div>
        </div>

        {/* Table Card */}
        <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm">
          <SalesStaffOrderList
            orders={filteredOrders}
            loading={loading}
            onVerify={handleOpenDrawer}
            onReject={(order) => {
              if (window.confirm('Reject order?')) {
                rejectOrder(order._id).then(() => fetchOrders())
              }
            }}
            onViewDetail={handleOpenDrawer}
            onChat={handleChat}
          />
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between px-2 text-sm text-gray-500">
          <span>
            Showing 1-{filteredOrders.length} of {orders.length} orders
          </span>
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

      <OrderDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        onUpdate={() => {
          fetchOrders()
        }}
      />
    </Container>
  )
}
