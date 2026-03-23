import { useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import type { AdminInvoiceListItem } from '@/shared/types'
import type {
  AdminOrderDetail,
  AdminOrderDetailApiResponse
} from '@/shared/types/admin-order.types'
import type { AdminAccount } from '@/shared/types/admin-account.types'
import { orderAdminService } from '@/shared/services/admin/orderService'
import {
  useGetAdminsByRole,
  useAssignOrderStaff,
  useAssignLabeling
} from '@/features/manager/hooks'
import { salesService } from '@/features/sales/services/salesService'
import { isManufacturingOrder } from '@/shared/types/order.types'
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  IoPersonOutline,
  IoCallOutline,
  IoCashOutline,
  IoLocationOutline,
  IoAlertCircleOutline,
  IoShieldCheckmarkOutline,
  IoListOutline
} from 'react-icons/io5'
import { formatPrice, toTitleCase } from '@/shared/utils'

function getInvoiceStatusBadgeClass(status: string) {
  switch (status) {
    case InvoiceStatus.PENDING:
    case InvoiceStatus.DEPOSITED:
    case InvoiceStatus.READY_TO_SHIP:
      return 'bg-blue-50 text-blue-600 border-blue-100'
    case InvoiceStatus.APPROVED:
    case InvoiceStatus.WAITING_ASSIGN:
    case InvoiceStatus.ONBOARD:
    case InvoiceStatus.DELIVERED:
    case InvoiceStatus.COMPLETED:
      return 'bg-mint-50 text-mint-700 border-mint-100'
    case InvoiceStatus.REJECTED:
    case InvoiceStatus.CANCELED:
    case InvoiceStatus.CANCEL:
      return 'bg-red-50 text-red-600 border-red-100'
    default:
      return 'bg-neutral-50 text-neutral-600 border-neutral-200'
  }
}

function StaffSelect({
  staffList,
  value,
  onChange,
  disabled,
  className,
  staffOrderStats
}: {
  staffList: AdminAccount[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  className?: string
  staffOrderStats?: Record<string, { total: number; assigned: number }>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedStaff = staffList.find((s) => s._id === value)

  return (
    <div className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm font-medium flex items-center justify-between hover:border-mint-400 focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all outline-none disabled:opacity-50"
      >
        <span
          className={selectedStaff ? 'text-gray-900' : 'text-neutral-400 truncate pr-2 text-left'}
        >
          {selectedStaff
            ? `${selectedStaff.name} (${selectedStaff.email})`
            : 'Select an operation worker'}
        </span>
        <svg
          className={`shrink-0 w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl shadow-mint-900/5 z-20 py-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-4 py-2.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 mb-1">
              Operation Staff List
            </div>
            {staffList.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-400 italic">No operators found</div>
            ) : (
              staffList.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    onChange(s._id)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex flex-col gap-0.5 ${
                    value === s._id
                      ? 'bg-mint-50 text-mint-700 font-semibold'
                      : 'text-gray-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span
                    className={`text-[10px] truncate ${value === s._id ? 'text-mint-500' : 'text-neutral-400'}`}
                  >
                    {s.email}
                  </span>
                  <span
                    className={`text-[10px] mt-0.5 ${value === s._id ? 'text-mint-600' : 'text-neutral-500'}`}
                  >
                    <IoListOutline className="inline-block mr-1" />
                    {staffOrderStats?.[s._id]?.assigned ?? 0} assigned /{' '}
                    {staffOrderStats?.[s._id]?.total ?? 0} total orders
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export type InvoiceCardProps = {
  invoice: AdminInvoiceListItem
  isExpanded: boolean
  isOnboarding: boolean
  onToggleExpanded: () => void
  onOnboard: (invoiceId: string) => Promise<unknown>
  onComplete?: (invoiceId: string) => Promise<unknown>
  showOnboardButton?: boolean
  hideActions?: boolean
  onRefetch?: () => void
}

export default function ManagerInvoiceCard({
  invoice,
  isExpanded,
  isOnboarding,
  onToggleExpanded: _onToggleExpanded,
  onOnboard,
  onComplete,
  showOnboardButton,
  hideActions = false,
  onRefetch
}: InvoiceCardProps) {
  const orderIds = useMemo(() => invoice.orders?.map((o) => o.id) ?? [], [invoice.orders])

  const orderQueries = useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: ['admin-order-detail', orderId],
      queryFn: () => orderAdminService.getOrderById(orderId),
      enabled: isExpanded && !!orderId,
      staleTime: 30_000
    }))
  })

  const { data: fullInvoiceResponse, isLoading: isInvoiceLoading } = useQuery({
    queryKey: ['admin-invoice-detail-actual', invoice.id],
    queryFn: () => salesService.getInvoiceById(invoice.id),
    enabled: isExpanded,
    staleTime: 30_000
  })
  const fullInvoiceDetail = fullInvoiceResponse?.data

  const hasAnyOrderLoading = orderQueries.some((q) => q.isLoading) || isInvoiceLoading
  const hasAnyOrderError = orderQueries.some((q) => q.isError)

  const ordersData = orderQueries
    .map((q) => (q.data as AdminOrderDetailApiResponse | undefined)?.data?.order)
    .filter(Boolean) as AdminOrderDetail[]

  const { data: staffData, isLoading: isStaffLoading } = useGetAdminsByRole(
    isExpanded ? 'OPERATION_STAFF' : undefined
  )
  const staffList = useMemo(() => staffData?.data?.admins ?? [], [staffData])

  const assignMutation = useAssignOrderStaff()
  const assignLabelingMutation = useAssignLabeling()
  const { data: allOrdersData } = useQuery({
    queryKey: ['admin-all-orders-for-assignment'],
    queryFn: () => orderAdminService.getAllOrders(1, 1000),
    enabled: isExpanded,
    staleTime: 30_000
  })

  const staffOrderStats = useMemo(() => {
    const stats: Record<string, { total: number; assigned: number }> = {}
    const allOrders = allOrdersData?.data?.orders?.data ?? []

    for (const s of staffList) {
      stats[s._id] = { total: 0, assigned: 0 }
    }

    for (const order of allOrders) {
      if (!order.assignedStaff) continue
      if (!stats[order.assignedStaff]) {
        stats[order.assignedStaff] = { total: 0, assigned: 0 }
      }
      stats[order.assignedStaff].total += 1
      if (order.status === OrderStatus.ASSIGNED) {
        stats[order.assignedStaff].assigned += 1
      }
    }

    return stats
  }, [allOrdersData, staffList])
  const [selectedStaffByOrderId, setSelectedStaffByOrderId] = useState<Record<string, string>>({})
  const [selectedLabelingStaff, setSelectedLabelingStaff] = useState('')
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'danger'
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  })

  const showResponseModal = (
    content: { title?: string; message: string },
    type: 'success' | 'danger' = 'success'
  ) => {
    setResponseModal({
      isOpen: true,
      title: content.title || (type === 'success' ? 'Success' : 'Action Failed'),
      message: content.message,
      type
    })
  }

  const handleError = (error: unknown, defaultTitle = 'Action Failed') => {
    let message = 'An unexpected error occurred. Please try again later.'
    if (error instanceof AxiosError) {
      message = error.response?.data?.message || error.message || message
    } else if (error instanceof Error) {
      message = error.message
    }
    showResponseModal({ title: defaultTitle, message }, 'danger')
  }

  const handleActionWithModals = async (
    action: (id: string) => Promise<unknown>,
    id: string,
    actionName: string
  ) => {
    try {
      const res: any = await action(id)
      toast.success(res?.message || `Successfully executed ${actionName.toLowerCase()}.`)
      onRefetch?.()
    } catch (err) {
      handleError(err, `${actionName} Error`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-neutral-100 bg-white shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900 font-heading leading-tight">
                {invoice.invoiceCode}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest border ${getInvoiceStatusBadgeClass(invoice.status)}`}
              >
                {toTitleCase(invoice.status)}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest leading-none">
              {isExpanded ? 'Invoice Overview' : 'Click for details'}
            </p>
          </div>

          <div className="flex gap-2">
            {showOnboardButton && !hideActions && (
              <button
                type="button"
                className="px-6 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50"
                disabled={isOnboarding}
                onClick={(e) => {
                  e.stopPropagation()
                  handleActionWithModals(onOnboard, invoice.id, 'Start Onboarding')
                }}
              >
                Start Onboarding
              </button>
            )}

            {invoice.status === InvoiceStatus.ONBOARD &&
              !hideActions &&
              ordersData.length > 0 &&
              ordersData.every((o) => o.status === OrderStatus.COMPLETED) && (
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50"
                  disabled={isOnboarding}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onComplete) {
                      handleActionWithModals(onComplete, invoice.id, 'Mark as Completed')
                    }
                  }}
                >
                  Mark as Completed
                </button>
              )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100">
                <IoPersonOutline size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                  Customer
                </span>
                <p className="text-sm font-semibold text-gray-900 truncate font-primary">
                  {invoice.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100">
                <IoCallOutline size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                  Phone Number
                </span>
                <p className="text-sm font-semibold text-gray-900 font-primary truncate">
                  {invoice.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-mint-600 shrink-0 border border-mint-100">
                <IoCashOutline size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 leading-none">
                  Billing Summary
                </span>
                {isExpanded && fullInvoiceDetail ? (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 tracking-widest leading-none">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-mono">
                        {formatPrice(fullInvoiceDetail.totalPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 tracking-widest leading-none">
                      <span>Shipping Fee</span>
                      <span className="text-gray-900 font-mono">
                        + {formatPrice(fullInvoiceDetail.feeShip || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-rose-400 tracking-widest leading-none">
                      <span>Discount</span>
                      <span className="text-rose-500 font-mono">
                        - {formatPrice(fullInvoiceDetail.totalDiscount || 0)}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-neutral-100 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
                        Total Amount
                      </span>
                      <span className="text-base font-bold text-mint-600 font-primary">
                        {(
                          (fullInvoiceDetail.totalPrice || 0) +
                          (fullInvoiceDetail.feeShip || 0) -
                          (fullInvoiceDetail.totalDiscount || 0)
                        ).toLocaleString()}{' '}
                        đ
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-mint-600 font-primary truncate">
                    {formatPrice(Number(invoice.finalPrice))}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-neutral-50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-100">
                <IoLocationOutline size={18} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                  Shipping Address
                </span>
                <p className="text-sm font-medium text-gray-600 leading-relaxed font-primary">
                  {invoice.address}
                </p>
              </div>
            </div>
          </div>

          {(invoice.status === InvoiceStatus.READY_TO_SHIP ||
            assignLabelingMutation.isSuccess ||
            (invoice.status === InvoiceStatus.COMPLETED &&
              (!!invoice.staffHandleDelivery || !!invoice.staffHandleDeliveryName))) &&
            !hideActions && (
              <div className="md:col-span-2 pt-6 mt-2 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-mint-50/50 rounded-3xl p-6 border border-mint-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-mint-600 shrink-0 shadow-sm border border-mint-50">
                      <IoShieldCheckmarkOutline size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-mint-700 uppercase tracking-widest mb-1 flex items-center gap-2">
                        Labeling Processing
                        <span className="flex h-1.5 w-1.5 rounded-full bg-mint-500 animate-ping" />
                      </p>
                      <p className="text-sm font-bold text-gray-900 font-primary truncate">
                        {invoice.staffHandleDeliveryName ||
                          (assignLabelingMutation.isSuccess &&
                            staffList.find((s) => s._id === selectedLabelingStaff)?.name) ||
                          'Operation Staff Assigned'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-mint-600/80">
                          {invoice.assignStaffHandleDeliveryAt
                            ? `Assigned on ${new Date(invoice.assignStaffHandleDeliveryAt).toLocaleString()}`
                            : assignLabelingMutation.isSuccess
                              ? `Assigned just now`
                              : 'This invoice is currently being prepared for shipping.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {invoice.status === InvoiceStatus.COMPLETED &&
            !invoice.staffHandleDelivery &&
            !invoice.staffHandleDeliveryName &&
            !assignLabelingMutation.isSuccess &&
            !hideActions && (
              <div className="md:col-span-2 pt-6 mt-2 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                  <div className="flex flex-col gap-6">
                    <div className="text-left shrink-0">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest pl-1 mb-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Assign Labeling Worker
                      </p>
                      <p className="text-xs text-blue-500/80 pl-1">
                        Assign a staff member to proceed with labeling, packaging, and shipping
                        preparation.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1 min-w-0">
                        <StaffSelect
                          staffList={staffList}
                          value={selectedLabelingStaff}
                          onChange={(v) => setSelectedLabelingStaff(v)}
                          disabled={assignLabelingMutation.isLoading || isStaffLoading}
                          className="w-full"
                          staffOrderStats={staffOrderStats}
                        />
                      </div>
                      <button
                        type="button"
                        className="px-8 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                        disabled={!selectedLabelingStaff || assignLabelingMutation.isLoading}
                        onClick={(e) => {
                          e.stopPropagation()
                          assignLabelingMutation
                            .assignLabeling({
                              invoiceId: invoice.id,
                              assignedStaff: selectedLabelingStaff
                            })
                            .then((res) => {
                              toast.success(
                                res.message || 'The labeling worker has been successfully assigned.'
                              )
                              onRefetch?.()

                              setSelectedLabelingStaff('')
                            })
                            .catch((err) => handleError(err, 'Assign Labeling Worker'))
                        }}
                      >
                        {assignLabelingMutation.isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          'Confirm Assignment'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="px-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Linked Orders Detail
        </h3>

        {hasAnyOrderLoading && (
          <div className="p-10 flex flex-col items-center gap-4 text-sm text-neutral-400 font-medium">
            <div className="w-8 h-8 border-3 border-mint-500 border-t-transparent rounded-full animate-spin" />
            Loading linked order details...
          </div>
        )}

        {hasAnyOrderError && (
          <div className="p-10 bg-red-50 rounded-2xl border border-red-100 text-center text-sm text-red-600 font-bold">
            <IoAlertCircleOutline className="mx-auto mb-2" size={32} />
            Error loading order details. Please try again.
          </div>
        )}

        {ordersData.map((order) => {
          const canAssign =
            invoice.status === InvoiceStatus.ONBOARD && order.status === OrderStatus.WAITING_ASSIGN
          const selectedStaff = selectedStaffByOrderId[order._id] ?? ''

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-neutral-100 shadow-sm"
            >
              <div className="p-6 border-b border-neutral-50 bg-neutral-50/30 rounded-t-[calc(1.5rem-1px)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-gray-900 font-heading truncate">
                      {order.orderCode}
                    </h4>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest truncate block">
                      ID: {order._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-semibold border tracking-wider ${
                        order.status === OrderStatus.COMPLETED
                          ? 'bg-mint-50 text-mint-700 border-mint-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {toTitleCase(order.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {!canAssign &&
                  order.status !== OrderStatus.WAITING_ASSIGN &&
                  order.assignedStaff && (
                    <div className="mb-6 p-4 rounded-3xl bg-mint-50/50 border border-mint-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-mint-600 border border-mint-50 shadow-sm shrink-0">
                        <IoShieldCheckmarkOutline size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-mint-700 uppercase tracking-widest mb-1 flex items-center gap-2">
                          Order Processing Staff
                          <span className="flex h-1.5 w-1.5 rounded-full bg-mint-500 animate-pulse" />
                        </p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {staffList.find((s) => s._id === order.assignedStaff)?.name ||
                            'Operation Staff Assigned'}
                        </p>
                      </div>
                    </div>
                  )}
                {canAssign && (
                  <div className="mb-6 p-4 rounded-2xl bg-mint-50/50 border border-mint-100">
                    <p className="text-[10px] font-bold text-mint-700 uppercase tracking-widest mb-3">
                      Assign Operation Staff
                    </p>
                    <div className="flex flex-col gap-3">
                      <StaffSelect
                        staffList={staffList}
                        value={selectedStaff}
                        onChange={(v) =>
                          setSelectedStaffByOrderId((cur) => ({ ...cur, [order._id]: v }))
                        }
                        disabled={assignMutation.isPending || isStaffLoading}
                        staffOrderStats={staffOrderStats}
                      />
                      <button
                        type="button"
                        className="w-full py-3 rounded-xl bg-mint-600 text-white text-sm font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        disabled={!selectedStaff || assignMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation()
                          assignMutation
                            .mutateAsync({
                              orderId: order._id,
                              assignedStaff: selectedStaff
                            })
                            .then((res: any) => {
                              toast.success(
                                res?.message ||
                                  'The staff has been successfully assigned to this order.'
                              )
                              onRefetch?.()
                            })
                            .catch((err) => handleError(err, 'Assign Operation Staff'))
                        }}
                      >
                        {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 leading-none">
                      Order Type
                    </span>
                    <p className="text-xs font-semibold text-gray-700 font-primary truncate">
                      {(order.type ?? []).map((t) => toTitleCase(t)).join(', ')}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 leading-none">
                      Price
                    </span>
                    <p className="text-xs font-semibold text-gray-700 font-primary truncate">
                      {formatPrice(order.price)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 leading-none">
                      Worker
                    </span>
                    <p className="text-xs font-bold text-gray-700 font-primary truncate">
                      {staffList.find((s) => s._id === order.assignedStaff)?.name || 'Not Assigned'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1 leading-none">
                      Assigned Date
                    </span>
                    <p className="text-xs font-semibold text-gray-700 font-primary truncate">
                      {order.assignedAt
                        ? new Date(order.assignedAt).toLocaleDateString()
                        : 'Not Assigned Yet'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-neutral-50">
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                    Items Detail
                  </p>
                  {order.products.map((line) => (
                    <div
                      key={line._id}
                      className="rounded-2xl border border-neutral-100 p-4 bg-neutral-50/30"
                    >
                      <div className="flex justify-between items-center mb-4 gap-2">
                        <span className="text-xs font-semibold text-gray-900 shrink-0">
                          Quantity: {line.quantity}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400 px-2 py-0.5 bg-white border border-neutral-100 rounded-md uppercase truncate">
                          {isManufacturingOrder(order) ? 'Manufacturing' : 'Normal'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-neutral-100 min-w-0">
                          <span className="text-[10px] font-semibold text-blue-500 uppercase block mb-2">
                            Frame Model
                          </span>
                          {line.product ? (
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {line.product.sku}
                              </p>
                              <p className="text-[10px] font-medium text-neutral-400 truncate">
                                UID: {line.product.product_id}
                              </p>
                              <p className="text-[11px] font-bold text-gray-700 mt-1">
                                {formatPrice(line.product.pricePerUnit)} / unit
                              </p>
                            </div>
                          ) : null}
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-neutral-100 min-w-0">
                          <span className="text-[10px] font-semibold text-mint-500 uppercase block mb-2">
                            Lens Tech
                          </span>
                          {line.lens ? (
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {line.lens.sku}
                              </p>
                              <p className="text-[10px] font-medium text-neutral-400 truncate">
                                ID: {line.lens.lens_id}
                              </p>
                              <p className="text-[11px] font-bold text-gray-700 mt-1">
                                {formatPrice(line.lens.pricePerUnit)} / unit
                              </p>
                              <div className="mt-2 pt-2 border-t border-neutral-50 text-[10px] font-semibold text-neutral-500 leading-normal">
                                PD: {line.lens.parameters.PD} <br />
                                L({line.lens.parameters.left.SPH}/{line.lens.parameters.left.CYL}/
                                {line.lens.parameters.left.AXIS}) <br />
                                R({line.lens.parameters.right.SPH}/{line.lens.parameters.right.CYL}/
                                {line.lens.parameters.right.AXIS})
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-300 italic">No lens data</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {ordersData.length === 0 && !hasAnyOrderLoading && !hasAnyOrderError && (
          <div className="p-10 text-center text-sm text-neutral-400 font-medium italic">
            No linked orders found for this invoice.
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={responseModal.isOpen}
        onClose={() => setResponseModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => setResponseModal((prev) => ({ ...prev, isOpen: false }))}
        title={responseModal.title}
        message={responseModal.message}
        confirmText="OK"
        cancelText=""
        type={responseModal.type === 'success' ? 'info' : 'danger'}
      />
    </div>
  )
}
