import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import type { AdminInvoiceListItem } from '@/shared/types'
import type {
  AdminOrderDetail,
  AdminOrderDetailApiResponse
} from '@/shared/types/admin-order.types'
import type { AdminAccount } from '@/shared/types/admin-account.types'
import { orderAdminService } from '@/shared/services/admin/orderService'
import { useGetAdminsByRole } from '@/features/manager/hooks/useGetAdminsByRole'
import { useAssignOrderStaff } from '@/features/manager/hooks/useAssignOrderStaff'
import { isManufacturingOrder } from '@/shared/types/order.types'

function getInvoiceStatusBadgeClass(status: string) {
  switch (status) {
    case InvoiceStatus.PENDING:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.DEPOSITED:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.APPROVED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.ONBOARD:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.DELIVERING:
      return 'bg-secondary-100 text-secondary-800'
    case InvoiceStatus.DELIVERED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.COMPLETED:
      return 'bg-primary-100 text-primary-800'
    case InvoiceStatus.REJECTED:
      return 'bg-danger-100 text-danger-800'
    case InvoiceStatus.CANCELED:
      return 'bg-danger-100 text-danger-800'
    default:
      return 'bg-neutral-100 text-neutral-700'
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
}

function StaffSelect({
  staffList,
  value,
  onChange,
  disabled
}: {
  staffList: AdminAccount[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <select
      className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">Chọn Operation staff</option>
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
  showOnboardButton
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

  const hasAnyOrderLoading = orderQueries.some((q) => q.isLoading)
  const hasAnyOrderError = orderQueries.some((q) => q.isError)

  const ordersData = orderQueries
    .map((q) => (q.data as AdminOrderDetailApiResponse | undefined)?.data?.order)
    .filter(Boolean) as AdminOrderDetail[]

  const { data: staffData, isLoading: isStaffLoading } = useGetAdminsByRole(
    isExpanded ? 'OPERATION_STAFF' : undefined
  )
  const staffList = staffData?.data?.admins ?? []

  const assignMutation = useAssignOrderStaff()
  const [selectedStaffByOrderId, setSelectedStaffByOrderId] = useState<Record<string, string>>({})

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div
        role="button"
        tabIndex={0}
        className="w-full text-left p-4 cursor-pointer"
        onClick={onToggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onToggleExpanded()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-neutral-900 truncate">{invoice.invoiceCode}</div>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getInvoiceStatusBadgeClass(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
              <div className="text-neutral-700">
                <span className="text-neutral-500">Customer:</span> {invoice.fullName}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Phone:</span> {invoice.phone}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Orders:</span> {invoice.orders?.length ?? 0}
              </div>
              <div className="text-neutral-700">
                <span className="text-neutral-500">Final price:</span> {invoice.finalPrice}
              </div>
              <div className="text-neutral-700 sm:col-span-2 lg:col-span-4">
                <span className="text-neutral-500">Address:</span> {invoice.address}
              </div>
              <div className="text-neutral-700 sm:col-span-2 lg:col-span-2">
                <span className="text-neutral-500">Created at:</span> {invoice.createdAt}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {showOnboardButton && (
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
                disabled={isOnboarding}
                onClick={async (e) => {
                  e.stopPropagation()
                  await onOnboard(invoice.id)
                }}
              >
                Change to ONBOARD
              </button>
            )}

            {invoice.status === InvoiceStatus.ONBOARD &&
              ordersData.length > 0 &&
              ordersData.every((o) => o.status === OrderStatus.COMPLETED) && (
                <button
                  type="button"
                  className="px-3 py-2 rounded-lg bg-secondary-500 text-white text-sm font-medium disabled:opacity-50"
                  disabled={isOnboarding}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await onComplete?.(invoice.id)
                  }}
                >
                  Change to COMPLETED
                </button>
              )}

            {invoice.status === InvoiceStatus.COMPLETED && (
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-secondary-500 text-white text-sm font-medium disabled:opacity-50"
                disabled={isOnboarding}
                onClick={async (e) => {
                  e.stopPropagation()
                  await onDelivering?.(invoice.id)
                }}
              >
                DELIVERY TO CUSTOMER
              </button>
            )}

            <div className="text-xs text-neutral-400">
              {isExpanded ? 'Hide orders' : 'View orders'}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
            <div className="text-xs font-semibold text-neutral-500 mb-2">Orders</div>

            {invoice.orders && invoice.orders.length > 0 ? (
              <div className="space-y-3">
                {hasAnyOrderLoading && (
                  <div className="text-sm text-neutral-500">Đang tải chi tiết order...</div>
                )}

                {hasAnyOrderError && (
                  <div className="text-sm text-red-600">Có lỗi khi tải chi tiết order.</div>
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
                      className="rounded-xl bg-white border border-neutral-200 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-neutral-900 truncate">
                            {order.orderCode}
                          </div>
                          <div className="text-xs text-neutral-500 truncate">
                            Order ID: {order._id}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs text-neutral-500">Status</div>
                          <div className="text-sm font-medium text-neutral-800">{order.status}</div>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div className="text-neutral-700">
                          <span className="text-neutral-500">Type:</span>{' '}
                          {(order.type ?? []).join(', ')}
                        </div>
                        <div className="text-neutral-700">
                          <span className="text-neutral-500">Price:</span> {order.price}
                        </div>
                        <div className="text-neutral-700">
                          <span className="text-neutral-500">Assigned staff:</span>{' '}
                          {order.assignedStaff ?? '-'}
                        </div>
                        <div className="text-neutral-700">
                          <span className="text-neutral-500">Assigned at:</span>{' '}
                          {order.assignedAt ?? '-'}
                        </div>
                      </div>

                      {canAssign && (
                        <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                          <div className="text-xs font-semibold text-neutral-600 mb-2">
                            Assign Operation Staff
                          </div>

                          {isStaffLoading ? (
                            <div className="text-sm text-neutral-500">
                              Đang tải danh sách staff...
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                              <StaffSelect
                                staffList={staffList}
                                value={selectedStaff}
                                onChange={(v) =>
                                  setSelectedStaffByOrderId((cur) => ({ ...cur, [order._id]: v }))
                                }
                                disabled={assignMutation.isPending}
                              />

                              <button
                                type="button"
                                className="px-3 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium disabled:opacity-50"
                                disabled={!selectedStaff || assignMutation.isPending}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  assignMutation.mutate({
                                    orderId: order._id,
                                    assignedStaff: selectedStaff
                                  })
                                }}
                              >
                                Assign
                              </button>
                            </div>
                          )}

                          {assignMutation.isError && (
                            <div className="mt-2 text-sm text-red-600">
                              {(assignMutation.error as any)?.response?.data?.message ||
                                (assignMutation.error as any)?.message ||
                                'Assign thất bại.'}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-neutral-500 mb-2">Items</div>
                        <div className="space-y-2">
                          {order.products.map((line) => (
                            <div
                              key={line._id}
                              className="rounded-lg border border-neutral-200 bg-neutral-50 p-2"
                            >
                              <div className="flex items-center justify-between gap-3 text-sm">
                                <div className="text-neutral-800 font-medium">
                                  Qty: {line.quantity}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {manufacturing ? 'MANUFACTURING' : 'NORMAL'}
                                </div>
                              </div>

                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div className="text-neutral-700">
                                  <div className="text-xs text-neutral-500 mb-1">Frame</div>
                                  {line.product ? (
                                    <div>
                                      <div className="font-medium text-neutral-800">
                                        {line.product.sku}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        {line.product.product_id}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        Price/unit: {line.product.pricePerUnit}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-neutral-500">-</div>
                                  )}
                                </div>

                                <div className="text-neutral-700">
                                  <div className="text-xs text-neutral-500 mb-1">Lens</div>
                                  {line.lens ? (
                                    <div>
                                      <div className="font-medium text-neutral-800">
                                        {line.lens.sku}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        {line.lens.lens_id}
                                      </div>
                                      <div className="text-xs text-neutral-500">
                                        Price/unit: {line.lens.pricePerUnit}
                                      </div>
                                      <div className="text-xs text-neutral-500">
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
                                    <div className="text-neutral-500">-</div>
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
                  <div className="text-sm text-neutral-500">Không lấy được chi tiết order.</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-neutral-500">Invoice này chưa có order.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
