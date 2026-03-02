import { useMemo, useState } from 'react'

import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import type { AdminInvoiceListItem } from '@/shared/types'

import type { AdminAccount } from '@/shared/types/admin-account.types'
import { useAdminOrderDetails } from '@/shared/hooks/useAdminOrderDetails'
import { useGetAdminsByRole } from '@/features/manager/hooks/useGetAdminsByRole'
import { useAssignOrderStaff } from '@/features/manager/hooks/useAssignOrderStaff'
import { isManufacturingOrder } from '@/shared/types/order.types'

function getInvoiceStatusBadgeClass(status: string) {
  switch (status) {
    case InvoiceStatus.PENDING:
      return 'bg-blue-50 text-blue-600'
    case InvoiceStatus.DEPOSITED:
      return 'bg-blue-50 text-blue-600'
    case InvoiceStatus.APPROVED:
      return 'bg-mint-50 text-mint-700'
    case InvoiceStatus.ONBOARD:
      return 'bg-mint-50 text-mint-700'
    case InvoiceStatus.DELIVERING:
      return 'bg-blue-50 text-blue-600'
    case InvoiceStatus.DELIVERED:
      return 'bg-mint-50 text-mint-700'
    case InvoiceStatus.COMPLETED:
      return 'bg-mint-50 text-mint-700'
    case InvoiceStatus.REJECTED:
      return 'bg-red-50 text-red-600'
    case InvoiceStatus.CANCELED:
      return 'bg-red-50 text-red-600'
    default:
      return 'bg-neutral-50 text-neutral-600'
  }
}

export type InvoiceCardProps = {
  invoice: AdminInvoiceListItem
  isExpanded: boolean
  isOnboarding: boolean
  onToggleExpanded: () => void
  onOnboard: (invoiceId: string) => Promise<unknown>
  onComplete?: (invoiceId: string) => Promise<unknown>
  onDelivering?: (invoiceId: string) => Promise<unknown>
  showOnboardButton?: boolean
  hideActions?: boolean
}

function StaffSelect({
  staffList,
  value,
  onChange,
  disabled,
  className
}: {
  staffList: AdminAccount[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <select
      className={`px-3 py-2 rounded-xl border border-neutral-100 bg-white text-sm focus:ring-2 focus:ring-mint-500/20 focus:border-mint-500 outline-none transition-all ${
        className ?? 'w-full'
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="">Choose Operation worker</option>
      {staffList.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name} ({s.email})
        </option>
      ))}
    </select>
  )
}

export default function InvoiceCard({
  invoice,
  isExpanded,
  isOnboarding,
  onToggleExpanded,
  onOnboard,
  onComplete,
  onDelivering,
  showOnboardButton,
  hideActions = false
}: InvoiceCardProps) {
  const orderIds = useMemo(() => invoice.orders?.map((o) => o.id) ?? [], [invoice.orders])

  const { ordersData, hasAnyOrderLoading, hasAnyOrderError } = useAdminOrderDetails({
    orderIds,
    enabled: isExpanded
  })

  const { data: staffData, isLoading: isStaffLoading } = useGetAdminsByRole(
    isExpanded ? 'OPERATION_STAFF' : undefined
  )
  const staffList = staffData?.data?.admins ?? []

  const assignMutation = useAssignOrderStaff()
  const [selectedStaffByOrderId, setSelectedStaffByOrderId] = useState<Record<string, string>>({})

  return (
    <div className="rounded-3xl border border-neutral-100 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div
        role="button"
        tabIndex={0}
        className="w-full text-left p-6 cursor-pointer"
        onClick={onToggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onToggleExpanded()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="font-bold text-gray-900 truncate font-heading">
                {invoice.invoiceCode}
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest ${getInvoiceStatusBadgeClass(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 text-sm font-medium">
              <div className="text-gray-600">
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                  Customer
                </span>{' '}
                {invoice.fullName}
              </div>
              <div className="text-gray-600">
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                  Phone
                </span>{' '}
                {invoice.phone}
              </div>
              <div className="text-gray-600">
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                  Orders
                </span>{' '}
                {invoice.orders?.length ?? 0} items
              </div>
              <div className="text-gray-900 font-bold">
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                  Total Price
                </span>{' '}
                {invoice.finalPrice}
              </div>
            </div>
            <div className="mt-4 text-gray-600 text-sm font-medium">
              <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                Shipping Address
              </span>{' '}
              {invoice.address}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            {showOnboardButton && !hideActions && (
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50"
                disabled={isOnboarding}
                onClick={async (e) => {
                  e.stopPropagation()
                  await onOnboard(invoice.id)
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
                  className="px-5 py-2.5 rounded-xl bg-mint-600 text-white text-xs font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50"
                  disabled={isOnboarding}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await onComplete?.(invoice.id)
                  }}
                >
                  Mark as Completed
                </button>
              )}

            {invoice.status === InvoiceStatus.COMPLETED && !hideActions && (
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                disabled={isOnboarding}
                onClick={async (e) => {
                  e.stopPropagation()
                  await onDelivering?.(invoice.id)
                }}
              >
                Start Delivery
              </button>
            )}

            <div className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mt-2">
              {isExpanded ? 'Click to collapse' : 'Click to expand'}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 animate-fade-in-up">
          <div className="rounded-2xl border border-neutral-100 bg-gray-50/50 p-6">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
              Linked Orders
            </div>

            {invoice.orders && invoice.orders.length > 0 ? (
              <div className="space-y-4">
                {hasAnyOrderLoading && (
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <div className="w-4 h-4 border-2 border-mint-500 border-t-transparent rounded-full animate-spin" />
                    Loading order details...
                  </div>
                )}

                {hasAnyOrderError && (
                  <div className="text-sm text-red-500 font-bold">Error loading order details.</div>
                )}

                {ordersData.map((order) => {
                  const manufacturing = isManufacturingOrder(order)
                  const canAssign =
                    invoice.status === InvoiceStatus.ONBOARD &&
                    order.status === OrderStatus.WAITING_ASSIGN

                  const selectedStaff = selectedStaffByOrderId[order._id] ?? ''

                  return (
                    <div
                      key={order._id}
                      className="rounded-2xl bg-white border border-neutral-100 p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 font-heading">
                            {order.orderCode}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            ID: {order._id}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {canAssign ? (
                            <div
                              className="flex flex-col items-end gap-3"
                              style={{ minWidth: 200 }}
                            >
                              {isStaffLoading ? (
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                  Loading staff...
                                </div>
                              ) : (
                                <>
                                  <StaffSelect
                                    staffList={staffList}
                                    value={selectedStaff}
                                    onChange={(v) =>
                                      setSelectedStaffByOrderId((cur) => ({
                                        ...cur,
                                        [order._id]: v
                                      }))
                                    }
                                    disabled={assignMutation.isPending}
                                    className="w-full text-xs font-medium"
                                  />
                                  <button
                                    type="button"
                                    className="w-full px-4 py-2 rounded-xl bg-mint-600 text-white text-xs font-bold hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-mint-50"
                                    disabled={!selectedStaff || assignMutation.isPending}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      assignMutation.mutate({
                                        orderId: order._id,
                                        assignedStaff: selectedStaff
                                      })
                                    }}
                                  >
                                    Assign Task
                                  </button>
                                </>
                              )}
                              {assignMutation.isError && (
                                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                  Assign Failed
                                </div>
                              )}
                            </div>
                          ) : (
                            order.assignedStaff && (
                              <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-100 min-w-[180px]">
                                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-50 flex items-center justify-center text-neutral-400">
                                  <IoPersonOutline size={14} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">
                                    Assigned Staff
                                  </p>
                                  <p className="text-xs font-bold text-gray-800 truncate">
                                    {order.assignedStaff}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-medium">
                        <div className="text-gray-600 italic">
                          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5 not-italic">
                            Order Type
                          </span>
                          {(order.type ?? []).join(', ')}
                        </div>
                        <div className="text-gray-600">
                          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                            Price
                          </span>{' '}
                          {order.price}
                        </div>
                        <div className="text-gray-600">
                          <span className="text-gray-400 font-bold uppercase text-[10px] block mb-0.5">
                            Assigned Date
                          </span>{' '}
                          {order.assignedAt ? new Date(order.assignedAt).toLocaleDateString() : '-'}
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          Items Details
                        </div>
                        <div className="space-y-3">
                          {order.products.map((line) => (
                            <div
                              key={line._id}
                              className="rounded-xl border border-neutral-100 bg-gray-50/50 p-4"
                            >
                              <div className="flex items-center justify-between gap-3 text-sm mb-4">
                                <div className="text-gray-900 font-bold">
                                  Quantity: {line.quantity}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-2 py-0.5 border border-gray-100 rounded-md">
                                  {manufacturing ? 'MANUFACTURING' : 'NORMAL'}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                <div className="p-3 bg-white rounded-lg border border-gray-100">
                                  <div className="text-[10px] font-bold text-blue-400 uppercase mb-2">
                                    Frame Model
                                  </div>
                                  {line.product ? (
                                    <div className="space-y-1">
                                      <div className="font-bold text-gray-800">
                                        {line.product.sku}
                                      </div>
                                      <div className="text-xs text-gray-400 font-medium">
                                        UID: {line.product.product_id}
                                      </div>
                                      <div className="text-xs text-gray-600 font-bold">
                                        {line.product.pricePerUnit} / unit
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-300 italic">-</div>
                                  )}
                                </div>

                                <div className="p-3 bg-white rounded-lg border border-gray-100">
                                  <div className="text-[10px] font-bold text-mint-500 uppercase mb-2">
                                    Lens Tech
                                  </div>
                                  {line.lens ? (
                                    <div className="space-y-1">
                                      <div className="font-bold text-gray-800">{line.lens.sku}</div>
                                      <div className="text-xs text-gray-400 font-medium font-mono">
                                        {line.lens.lens_id}
                                      </div>
                                      <div className="text-xs text-gray-600 font-bold">
                                        {line.lens.pricePerUnit} / unit
                                      </div>
                                      <div className="mt-2 text-[10px] text-gray-500 font-bold border-t border-gray-50 pt-2 uppercase">
                                        PD: {line.lens.parameters.PD} • L(
                                        {line.lens.parameters.left.SPH}/
                                        {line.lens.parameters.left.CYL}/
                                        {line.lens.parameters.left.AXIS}) • R(
                                        {line.lens.parameters.right.SPH}/
                                        {line.lens.parameters.right.CYL}/
                                        {line.lens.parameters.right.AXIS})
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-300 italic">-</div>
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
                  <div className="text-sm text-gray-400 font-medium italic">
                    No order details found.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400 font-medium italic">
                No orders linked to this invoice.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
