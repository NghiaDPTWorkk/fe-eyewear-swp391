import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import type { AdminInvoiceListItem } from '@/shared/types'
import type {
  AdminOrderDetail,
  AdminOrderDetailApiResponse
} from '@/shared/types/admin-order.types'
import { orderAdminService } from '@/shared/services/admin/orderService'
import { useGetAdminsByRole } from '@/features/manager-staff/hooks/useGetAdminsByRole'
import { useAssignOrderStaff } from '@/features/manager-staff/hooks/useAssignOrderStaff'
import { useAssignLabeling } from '@/features/manager-staff/hooks/useAssignLabeling'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  IoPersonOutline,
  IoCallOutline,
  IoBagOutline,
  IoCashOutline,
  IoLocationOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5'
import { StaffSelect } from './components/StaffSelect'
import { LinkedOrdersSection } from './components/LinkedOrdersSection'

export type InvoiceCardProps = {
  invoice: AdminInvoiceListItem
  isExpanded: boolean
  isOnboarding: boolean
  onToggleExpanded: () => void
  onOnboard: (id: string) => Promise<unknown>
  onComplete?: (id: string) => Promise<unknown>
  showOnboardButton?: boolean
  hideActions?: boolean
  onRefetch?: () => void
}

const getStatusBadge = (s: string) => {
  if (
    [InvoiceStatus.PENDING, InvoiceStatus.DEPOSITED, InvoiceStatus.READY_TO_SHIP].includes(s as any)
  )
    return 'bg-blue-50 text-blue-600 border-blue-100'
  if (
    [
      InvoiceStatus.APPROVED,
      InvoiceStatus.WAITING_ASSIGN,
      InvoiceStatus.ONBOARD,
      InvoiceStatus.DELIVERED,
      InvoiceStatus.COMPLETED
    ].includes(s as any)
  )
    return 'bg-mint-50 text-mint-700 border-mint-100'
  return 'bg-red-50 text-red-600 border-red-100'
}

export default function ManagerInvoiceCard({
  invoice,
  isExpanded,
  isOnboarding,
  onOnboard,
  onComplete,
  showOnboardButton,
  hideActions = false,
  onRefetch
}: InvoiceCardProps) {
  const orderIds = useMemo(() => invoice.orders?.map((o) => o.id) ?? [], [invoice.orders])
  const orderQueries = useQueries({
    queries: orderIds.map((id) => ({
      queryKey: ['admin-order-detail', id],
      queryFn: () => orderAdminService.getOrderById(id),
      enabled: isExpanded && !!id,
      staleTime: 30000
    }))
  })
  const { data: staffData, isLoading: isStaffLoading } = useGetAdminsByRole(
    isExpanded ? 'OPERATION_STAFF' : undefined
  )
  const staffList = staffData?.data?.admins ?? []
  const assignMutation = useAssignOrderStaff()
  const assignLabelingMutation = useAssignLabeling()
  const [selectedStaffByOrderId, setSelectedStaffByOrderId] = useState<Record<string, string>>({})
  const [selectedLabelingStaff, setSelectedLabelingStaff] = useState('')
  const [responseModal, setResponseModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'danger'
  })

  const handleError = (error: unknown, title = 'Action Failed') => {
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : 'Unknown error'
    setResponseModal({ isOpen: true, title, message, type: 'danger' })
  }

  const ordersData = orderQueries
    .map((q) => (q.data as AdminOrderDetailApiResponse | undefined)?.data?.order)
    .filter(Boolean) as AdminOrderDetail[]

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-neutral-100 bg-white shadow-sm p-6">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {invoice.invoiceCode}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-[10px] uppercase font-semibold border ${getStatusBadge(invoice.status)}`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest leading-none">
              {isExpanded ? 'Invoice Overview' : 'Click for details'}
            </p>
          </div>
          <div className="flex gap-2">
            {showOnboardButton && !hideActions && (
              <button
                className="px-6 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 active:scale-95 disabled:opacity-50"
                disabled={isOnboarding}
                onClick={() =>
                  onOnboard(invoice.id)
                    .then(() => onRefetch?.())
                    .catch((e) => handleError(e))
                }
              >
                Start Onboarding
              </button>
            )}
            {invoice.status === InvoiceStatus.ONBOARD &&
              !hideActions &&
              ordersData.length > 0 &&
              ordersData.every((o) => o.status === OrderStatus.COMPLETED) &&
              onComplete && (
                <button
                  className="px-6 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 active:scale-95 transition-all"
                  onClick={() =>
                    onComplete(invoice.id)
                      .then(() => onRefetch?.())
                      .catch((e) => handleError(e))
                  }
                >
                  Mark as Completed
                </button>
              )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                <IoPersonOutline size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                  Customer
                </span>
                <p className="text-sm font-semibold text-gray-900">{invoice.fullName}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                <IoCallOutline size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                  Phone
                </span>
                <p className="text-sm font-semibold text-gray-900">{invoice.phone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                <IoBagOutline size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                  Orders
                </span>
                <p className="text-sm font-semibold text-gray-900">
                  {invoice.orders?.length ?? 0} Linked
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-mint-600 border border-mint-100">
                <IoCashOutline size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                  Total
                </span>
                <p className="text-sm font-bold text-mint-600">{invoice.finalPrice} đ</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 pt-4 border-t border-neutral-50">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                <IoLocationOutline size={18} />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-1">
                  Address
                </span>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  {invoice.address}
                </p>
              </div>
            </div>
          </div>
          {(invoice.status === InvoiceStatus.READY_TO_SHIP ||
            assignLabelingMutation.isSuccess ||
            (invoice.status === InvoiceStatus.COMPLETED && invoice.staffHandleDeliveryName)) &&
            !hideActions && (
              <div className="md:col-span-2 pt-6 mt-2 border-t border-neutral-100">
                <div className="bg-mint-50/50 rounded-3xl p-6 border border-mint-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint-600 border border-mint-50 shadow-sm">
                    <IoShieldCheckmarkOutline size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-mint-700 uppercase mb-1">
                      Labeling Processing
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {invoice.staffHandleDeliveryName ||
                        (assignLabelingMutation.isSuccess &&
                          staffList.find((s) => s._id === selectedLabelingStaff)?.name) ||
                        'Assigned'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          {invoice.status === InvoiceStatus.COMPLETED &&
            !invoice.staffHandleDeliveryName &&
            !assignLabelingMutation.isSuccess &&
            !hideActions && (
              <div className="md:col-span-2 pt-6 mt-2 border-t border-neutral-100">
                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-blue-700 uppercase mb-1.5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Assign Labeling Worker
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <StaffSelect
                        staffList={staffList}
                        value={selectedLabelingStaff}
                        onChange={(v) => setSelectedLabelingStaff(v)}
                        disabled={assignLabelingMutation.isLoading || isStaffLoading}
                      />
                    </div>
                    <button
                      type="button"
                      className="px-8 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg"
                      disabled={!selectedLabelingStaff || assignLabelingMutation.isLoading}
                      onClick={() =>
                        assignLabelingMutation
                          .assignLabeling({
                            invoiceId: invoice.id,
                            assignedStaff: selectedLabelingStaff
                          })
                          .then(() => {
                            toast.success('Assigned.')
                            onRefetch?.()
                            setSelectedLabelingStaff('')
                          })
                          .catch((e) => handleError(e))
                      }
                    >
                      {assignLabelingMutation.isLoading ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <LinkedOrdersSection
        ordersData={ordersData}
        hasAnyOrderLoading={orderQueries.some((q) => q.isLoading)}
        hasAnyOrderError={orderQueries.some((q) => q.isError)}
        invoiceStatus={invoice.status}
        staffList={staffList}
        selectedStaffByOrderId={selectedStaffByOrderId}
        setSelectedStaffByOrderId={setSelectedStaffByOrderId}
        assignMutation={assignMutation}
        isStaffLoading={isStaffLoading}
        onRefetch={onRefetch}
        handleError={handleError}
        toast={toast}
      />
      <ConfirmationModal
        isOpen={responseModal.isOpen}
        onClose={() => setResponseModal((p) => ({ ...p, isOpen: false }))}
        onConfirm={() => setResponseModal((p) => ({ ...p, isOpen: false }))}
        title={responseModal.title}
        message={responseModal.message}
        confirmText="OK"
        cancelText=""
        type={responseModal.type === 'success' ? 'info' : 'danger'}
      />
    </div>
  )
}
