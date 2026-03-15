import {
  IoPersonOutline,
  IoCubeOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoCloseCircleOutline,
  IoWalletOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { Card, Button } from '@/components'
import { ArrowLeft } from 'lucide-react'
import {
  useReturnTicketDetail,
  useSaleStaffReturns
} from '@/features/sales/hooks/useSaleStaffReturns'
import { formatPrice } from '@/shared/utils'

interface ReturnDetailsProps {
  returnId: string
  onBack: () => void
}

export default function ReturnDetails({ returnId, onBack }: ReturnDetailsProps) {
  const { data: ticket, isLoading } = useReturnTicketDetail(returnId)
  const { updateStatus, isUpdating } = useSaleStaffReturns()

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!ticket) return
    await updateStatus({ id: ticket.id, status })
    // We don't necessarily go back, the status will update in the UI via react-query
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-mint-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 animate-pulse font-medium">Fetching return details...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center p-20">
        <p className="text-slate-400">Ticket not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-mint-50 rounded-xl shadow-sm transition-all duration-300 border border-neutral-100 hover:border-mint-200 hover:shadow-md hover:-translate-x-0.5 active:scale-90 group"
          >
            <ArrowLeft
              size={20}
              className="text-neutral-500 group-hover:text-mint-600 transition-colors stroke-[2.5px]"
            />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Return Detail</h1>
            <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
              <span>#{ticket.id.toUpperCase()}</span>
              <span>•</span>
              <span>{ticket.createdAt}</span>
            </div>
          </div>
        </div>
        <div
          className={`px-4 py-1.5 font-semibold rounded-full text-xs uppercase tracking-wider border shadow-sm shadow-mint-50 ${
            ticket.status === 'PENDING'
              ? 'bg-orange-50 text-orange-600 border-orange-100'
              : ticket.status === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}
        >
          {ticket.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoPersonOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Ticket Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Customer ID
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{ticket.customerId}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Ticket ID
                  </label>
                  <div className="font-medium text-neutral-900 mt-1">{ticket.id}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Original Order ID
                  </label>
                  <div className="font-medium text-mint-600 mt-1">{ticket.orderId}</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Refund Amount
                  </label>
                  <div className="font-bold text-slate-900 mt-1 text-lg">
                    {formatPrice(ticket.money)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <IoCubeOutline className="text-lg text-neutral-400" />
              <h2 className="font-semibold text-lg text-neutral-900">Return Content</h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-8">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                    Reason
                  </label>
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-semibold">
                    {ticket.reason}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                    Quantity
                  </label>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">
                    {ticket.quantity} {ticket.quantity > 1 ? 'items' : 'item'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                  Customer Description
                </label>
                <div className="bg-neutral-50 p-4 rounded-xl text-neutral-700 text-sm leading-relaxed italic border border-neutral-100">
                  "{ticket.description}"
                </div>
              </div>

              {ticket.media && ticket.media.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide block mb-2">
                    Evidence Photos
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {ticket.media.map((photo, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl overflow-hidden border border-neutral-200 group relative"
                      >
                        <img
                          src={photo}
                          alt="Customer evidence"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-2 border-mint-500 shadow-lg shadow-mint-50">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6 flex items-center gap-2">
              <IoCheckmarkCircle className="text-mint-500" />
              Process Decision
            </h2>

            <div className="space-y-3">
              <Button
                isFullWidth
                className="bg-mint-600 hover:bg-mint-700 text-white font-bold h-12 rounded-2xl shadow-lg shadow-mint-100 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                leftIcon={<IoCheckmarkCircle size={20} />}
                onClick={() => handleAction('APPROVED')}
                isLoading={isUpdating}
                disabled={ticket.status !== 'PENDING'}
              >
                Approve Return
              </Button>
              <Button
                isFullWidth
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-12 rounded-2xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
                leftIcon={<IoCloseCircleOutline size={20} />}
                onClick={() => handleAction('REJECTED')}
                isLoading={isUpdating}
                disabled={ticket.status !== 'PENDING'}
              >
                Reject Return
              </Button>
            </div>

            {ticket.status !== 'PENDING' && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center font-medium">
                This ticket has already been processed and is now{' '}
                <span className="font-bold">{ticket.status}</span>.
              </div>
            )}
          </Card>

          <Card className="p-5 bg-amber-50 border-amber-100">
            <div className="flex items-center gap-2 mb-3 text-amber-800">
              <IoAlertCircleOutline className="text-xl" />
              <h3 className="font-semibold uppercase tracking-wider text-xs">
                Decision Guidelines
              </h3>
            </div>
            <ul className="text-xs space-y-2 text-amber-800/80 list-disc pl-4 font-medium">
              <li>Review customer description carefully</li>
              <li>Verify evidence photos for any damage</li>
              <li>Check original order details if necessary</li>
              <li>Approved returns will trigger refund process</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <IoWalletOutline />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Amount
                  </p>
                  <p className="text-sm font-bold text-slate-700">{formatPrice(ticket.money)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                  <IoTimeOutline />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    Last Update
                  </p>
                  <p className="text-sm font-bold text-slate-700">{ticket.updatedAt}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
