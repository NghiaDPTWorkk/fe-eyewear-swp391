import React from 'react'

import { PageHeader } from '@/features/staff'
import { LabStatusMetrics } from '@/features/sales/components/lab/LabStatusMetrics'
import { LensSpecificationsCard } from '@/features/sales/components/lab/LensSpecificationsCard'
import { ActiveLabOrdersTable } from '@/features/sales/components/lab/ActiveLabOrdersTable'
import { OrderPagination } from '@/features/sales/components/orders/OrderPagination'
import { ExpediteRequestModal } from '@/features/sales/components/lab/ExpediteRequestModal'
import { useSalesStaffLabOrders } from '@/features/sales/hooks'

export default function SaleStaffLabStatusPage() {
  const [page, setPage] = React.useState(1)
  const { data, isLoading } = useSalesStaffLabOrders(page, 5)
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [isExpediteModalOpen, setIsExpediteModalOpen] = React.useState(false)
  const [orderToExpedite, setOrderToExpedite] = React.useState<any>(null)

  const labOrders = React.useMemo(() => data?.orders || [], [data])
  const totalPages = React.useMemo(() => {
    if (labOrders.length === 0 && page === 1) return 1
    return data?.pagination?.totalPages || 1
  }, [data, labOrders, page])

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
      <PageHeader
        title="Lab Status Tracking"
        subtitle="Monitor production stages, urgent requests, and lens specifications."
        breadcrumbs={[
          { label: 'Dashboard', path: '/sale-staff/dashboard' },
          { label: 'Lab Status' }
        ]}
        noMargin={true}
      />

      <div className="grid grid-cols-12 gap-6">
        <LabStatusMetrics orders={labOrders} />
        <LensSpecificationsCard selectedOrder={selectedOrder} />
      </div>

      <div className="bg-white border border-neutral-100 shadow-sm rounded-2xl overflow-hidden">
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
