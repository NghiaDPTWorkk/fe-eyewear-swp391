import { IoAlertCircleOutline, IoShieldCheckmarkOutline } from 'react-icons/io5'
import { OrderStatus } from '@/shared/utils/enums/order.enum'
import { InvoiceStatus } from '@/shared/utils/enums/invoice.enum'
import type { AdminOrderDetail } from '@/shared/types/admin-order.types'
import type { AdminAccount } from '@/shared/types/admin-account.types'
import { StaffSelect } from './StaffSelect'

interface LinkedOrdersSectionProps {
  ordersData: AdminOrderDetail[]
  hasAnyOrderLoading: boolean
  hasAnyOrderError: boolean
  invoiceStatus: string
  staffList: AdminAccount[]
  selectedStaffByOrderId: Record<string, string>
  setSelectedStaffByOrderId: React.Dispatch<React.SetStateAction<Record<string, string>>>
  assignMutation: any
  isStaffLoading: boolean
  onRefetch?: () => void
  handleError: (e: any, t?: string) => void
  toast: any
}

export function LinkedOrdersSection({
  ordersData,
  hasAnyOrderLoading,
  hasAnyOrderError,
  invoiceStatus,
  staffList,
  selectedStaffByOrderId,
  setSelectedStaffByOrderId,
  assignMutation,
  isStaffLoading,
  onRefetch,
  handleError,
  toast
}: LinkedOrdersSectionProps) {
  if (hasAnyOrderLoading)
    return (
      <div className="p-10 flex flex-col items-center gap-4 text-sm text-neutral-400 font-medium">
        <div className="w-8 h-8 border-3 border-mint-500 border-t-transparent rounded-full animate-spin" />
        Loading linked order details...
      </div>
    )
  if (hasAnyOrderError)
    return (
      <div className="p-10 bg-red-50 rounded-2xl border border-red-100 text-center text-sm text-red-600 font-bold">
        <IoAlertCircleOutline className="mx-auto mb-2" size={32} />
        Error loading order details.
      </div>
    )
  if (ordersData.length === 0)
    return (
      <div className="p-10 text-center text-sm text-neutral-400 font-medium italic">
        No linked orders found.
      </div>
    )

  return (
    <div className="space-y-4">
      <h3 className="px-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">
        Linked Orders Detail
      </h3>
      {ordersData.map((order) => {
        const canAssign =
          invoiceStatus === InvoiceStatus.ONBOARD && order.status === OrderStatus.WAITING_ASSIGN
        const selectedStaff = selectedStaffByOrderId[order._id] ?? ''
        return (
          <div key={order._id} className="bg-white rounded-3xl border border-neutral-100 shadow-sm">
            <div className="p-6 border-b border-neutral-50 bg-neutral-50/30 rounded-t-3xl">
              <div className="flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-gray-900 truncate">{order.orderCode}</h4>
                  <span className="text-[10px] text-neutral-400 uppercase">ID: {order._id}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-semibold border uppercase ${order.status === OrderStatus.COMPLETED ? 'bg-mint-50 text-mint-700 border-mint-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              {!canAssign && order.status !== OrderStatus.WAITING_ASSIGN && order.assignedStaff && (
                <div className="mb-6 p-4 rounded-3xl bg-mint-50/50 border border-mint-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-mint-600 shadow-sm shrink-0">
                    <IoShieldCheckmarkOutline size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-mint-700 uppercase mb-1">
                      Processing Staff
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {staffList.find((s) => s._id === order.assignedStaff)?.name || 'Assigned'}
                    </p>
                  </div>
                </div>
              )}
              {canAssign && (
                <div className="mb-6 p-4 rounded-2xl bg-mint-50/50 border border-mint-100">
                  <p className="text-[10px] font-bold text-mint-700 uppercase mb-3">
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
                    />
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-mint-600 text-white text-sm font-bold shadow-lg shadow-mint-100 hover:bg-mint-700 transition-all active:scale-95 disabled:opacity-50"
                      disabled={!selectedStaff || assignMutation.isPending}
                      onClick={() => {
                        assignMutation
                          .mutateAsync({ orderId: order._id, assignedStaff: selectedStaff })
                          .then((res: any) => {
                            toast.success(res?.message || 'Staff assigned.')
                            onRefetch?.()
                          })
                          .catch((err: any) => handleError(err, 'Assign Staff'))
                      }}
                    >
                      {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 uppercase text-[10px]">
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Type</span>
                  <p className="font-bold text-gray-700">{(order.type ?? []).join(', ')}</p>
                </div>
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Price</span>
                  <p className="font-bold text-gray-700">{order.price} đ</p>
                </div>
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Worker</span>
                  <p className="font-bold text-gray-700">
                    {staffList.find((s) => s._id === order.assignedStaff)?.name || 'Not Assigned'}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-400 font-semibold block mb-1">Date</span>
                  <p className="font-bold text-gray-700">
                    {order.assignedAt ? new Date(order.assignedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
