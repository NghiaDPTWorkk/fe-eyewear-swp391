import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Card, Input } from '@/components'
import { cn } from '@/lib/utils'
import { OrderVerifyModal } from '@/features/sales/components/OrderVerifyModal'
import { OrderPagination } from '@/features/sales/components/OrderPagination'
import { useSalesStaffOrders } from '@/features/sales/hooks/useSalesStaffOrders'
import { useSalesStaffAction } from '@/features/sales/hooks/useSalesStaffAction'
import { IoFilter, IoAdd, IoSearchOutline } from 'react-icons/io5'
import type { Order, LensParameter } from '@/features/sales/types'
import { toast } from 'react-hot-toast'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import { PrescriptionMetrics, PrescriptionTable } from '@/features/sales/components/prescriptions'

export default function SaleStaffPrescriptionPage() {
  const { rxOrders, loading, fetchOrders } = useSalesStaffOrders()
  const { verifyOrder, rejectOrder, processing } = useSalesStaffAction()

  const [SelectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const rxMetrics = useMemo(() => {
    return {
      pendingLab: rxOrders.filter((o) => (o as any).rawStatus === OrderStatus.WAITING_ASSIGN)
        .length,
      grinding: rxOrders.filter((o) => (o as any).rawStatus === OrderStatus.MAKING).length,
      qa: rxOrders.filter((o) => (o as any).rawStatus === OrderStatus.PACKAGING).length,
      completed: rxOrders.filter((o) => (o as any).rawStatus === OrderStatus.COMPLETED).length
    }
  }, [rxOrders])

  const filterOptions = [
    { label: 'All Orders', value: 'All' },
    { label: 'Wait Verify', value: 'WAITING_ASSIGN' },
    { label: 'Processing', value: 'PROCESSING' }
  ]

  const filteredOrders = useMemo(() => {
    return rxOrders.filter((order) => {
      const matchSearch =
        order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'All' || order.status === filter
      return matchSearch && matchFilter
    })
  }, [rxOrders, search, filter])

  const handleVerifySubmit = async (params: LensParameter) => {
    if (!SelectedOrder) return
    if (await verifyOrder(SelectedOrder.id, params)) {
      toast.success('Prescription verified')
      setIsVerifyModalOpen(false)
      fetchOrders()
    } else toast.error('Verification failed')
  }

  const handleReject = async (order: Order) => {
    if (order.invoiceId && window.confirm('Reject this order?')) {
      if (await rejectOrder(order.invoiceId)) {
        toast.success('Rejected')
        fetchOrders()
      } else toast.error('Rejection failed')
    }
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
          <Link
            to="/salestaff/orders"
            className="text-neutral-400 hover:text-primary-500 transition-colors"
          >
            Orders
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-primary-500 font-semibold">Prescriptions</span>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Prescription Orders</h1>
      </div>

      <PrescriptionMetrics counts={rxMetrics} />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="relative flex-1 max-w-xl w-full">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <Input
            type="text"
            placeholder="Search prescriptions..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/30 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-neutral-400"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto relative">
          <div className="relative">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all min-w-[170px] justify-between h-[42px]',
                isFilterOpen
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center gap-2">
                <IoFilter /> Filter:{' '}
                {filterOptions.find((o) => o.value === filter)?.label || filter}
              </div>
            </Button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <Card className="absolute top-full mt-2 right-0 w-56 z-20 p-2 shadow-xl border border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    {filterOptions.map((opt) => (
                      <Button
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
                      </Button>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
          <Button colorScheme="primary" leftIcon={<IoAdd className="text-lg" />}>
            New Order
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border border-neutral-200 shadow-sm rounded-xl">
        <PrescriptionTable
          orders={filteredOrders}
          loading={loading}
          onVerify={(o) => {
            setSelectedOrder(o)
            setIsVerifyModalOpen(true)
          }}
          onReject={handleReject}
        />
      </Card>

      <OrderPagination total={filteredOrders.length} currentPage={1} pageSize={10} />

      <OrderVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onSubmit={handleVerifySubmit}
        isProcessing={processing}
      />
    </Container>
  )
}
