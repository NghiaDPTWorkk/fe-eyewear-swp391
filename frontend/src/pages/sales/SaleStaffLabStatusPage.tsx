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
    <div className="space-y-8 relative">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-mint-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <PageHeader
          title="Lab Status Tracking"
          subtitle="Monitor production stages, urgent requests, and lens specifications."
          breadcrumbs={[
            { label: 'Dashboard', path: '/salestaff/dashboard' },
            { label: 'Lab Status' }
          ]}
          noMargin={true}
        />
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm ring-1 ring-slate-100/50">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-mint-600 hover:shadow-sm rounded-xl transition-all active:scale-95 group">
              <IoFilter className="text-slate-400 group-hover:text-mint-500" />
              All Urgencies
            </button>
            <div className="w-px h-6 bg-slate-100 my-auto"></div>
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all active:scale-95 group">
              <IoFilter className="text-slate-400 group-hover:text-blue-500" />
              All Stations
            </button>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-mint-500 to-emerald-600 text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-mint-200/50 transition-all active:scale-95 group shadow-md"
          >
            <IoRefresh
              className="group-hover:rotate-180 transition-transform duration-700"
              size={18}
            />
            Refresh Data
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
