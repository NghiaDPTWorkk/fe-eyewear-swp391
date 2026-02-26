import React from 'react'
import { IoFilter, IoRefresh } from 'react-icons/io5'

import { LabStatusMetrics } from '@/features/sales/components/lab/LabStatusMetrics'
import { LensSpecificationsCard } from '@/features/sales/components/lab/LensSpecificationsCard'
import { ActiveLabOrdersTable } from '@/features/sales/components/lab/ActiveLabOrdersTable'
import { PageHeader } from '@/features/staff'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { useSalesStaffLabOrders } from '@/features/sales/hooks/useSalesStaffInvoices'
import { ExpediteRequestModal } from '@/features/sales/components/lab/ExpediteRequestModal'

export default function SaleStaffLabStatusPage() {
  const [page, setPage] = React.useState(1)
  const { data, isLoading, refetch } = useSalesStaffLabOrders(page, 5)
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [isExpediteModalOpen, setIsExpediteModalOpen] = React.useState(false)
  const [orderToExpedite, setOrderToExpedite] = React.useState<any>(null)

  const labOrders = React.useMemo(() => data?.orders || [], [data])
  const totalPages = React.useMemo(() => {
    if (labOrders.length === 0 && page === 1) return 1
    return data?.pagination?.totalPages || 1
  }, [data, labOrders, page])

  // Set first order as default selection when data loads
  React.useEffect(() => {
    if (labOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(labOrders[0])
    }
  }, [labOrders, selectedOrder])

  if (isLoading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-gray-400">
        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium animate-pulse mt-4">Tracking production status...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Lab Status Tracking"
          subtitle="Monitor production stages, urgent requests, and lens specifications."
          breadcrumbs={[
            { label: 'Dashboard', path: '/salestaff/dashboard' },
            { label: 'Lab Status' }
          ]}
          noMargin={true}
        />
        <div className="flex gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-neutral-100 shadow-sm shadow-neutral-100/50">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all">
              All Urgencies
              <IoFilter className="text-neutral-400" />
            </button>
            <div className="w-px h-6 bg-neutral-100 my-auto"></div>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 rounded-xl transition-all">
              All Stations
              <IoFilter className="text-neutral-400" />
            </button>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-6 py-2.5 bg-mint-600 text-white rounded-2xl text-sm font-semibold hover:bg-mint-700 hover:shadow-lg hover:shadow-mint-100 transition-all active:scale-95 group"
          >
            <IoRefresh className="group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <LabStatusMetrics orders={labOrders} />
        <LensSpecificationsCard selectedOrder={selectedOrder} />
      </div>

      <div className="bg-white border border-neutral-50/50 shadow-sm rounded-2xl overflow-hidden">
        <ActiveLabOrdersTable
          orders={labOrders}
          selectedOrderId={selectedOrder?.id || null}
          onOrderSelect={(order) => setSelectedOrder(order)}
          onAction={(order) => {
            setOrderToExpedite(order)
            setIsExpediteModalOpen(true)
          }}
        />
        <OrderPagination
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>

      <ExpediteRequestModal
        isOpen={isExpediteModalOpen}
        onClose={() => {
          setIsExpediteModalOpen(false)
          setOrderToExpedite(null)
        }}
        order={orderToExpedite}
      />
    </div>
  )
}
