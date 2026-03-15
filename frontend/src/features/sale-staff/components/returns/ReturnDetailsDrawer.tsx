import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  IoClose,
  IoTimeOutline,
  IoWalletOutline,
  IoInformationCircleOutline,
  IoCubeOutline
} from 'react-icons/io5'
import { useReturnTicketDetail } from '@/features/sale-staff/hooks/useSaleStaffReturns'
import { Button } from '@/components'
import { formatPrice } from '@/shared/utils'

interface ReturnDetailsDrawerProps {
  isOpen: boolean
  onClose: () => void
  returnId: string | null
  onViewFullDetails: (id: string) => void
}

export const ReturnDetailsDrawer: React.FC<ReturnDetailsDrawerProps> = ({
  isOpen,
  onClose,
  returnId,
  onViewFullDetails
}) => {
  const { data: ticket, isLoading } = useReturnTicketDetail(returnId || '', isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
        {}
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Return Ticket
              </span>
              {ticket?.status && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100">
                  {ticket.status}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {ticket?.id ? `#${ticket.id.slice(-8).toUpperCase()}` : 'Loading...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <IoClose size={24} />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="w-8 h-8 border-4 border-mint-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-400">Loading details...</p>
            </div>
          ) : ticket ? (
            <>
              {}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-mint-600 border border-slate-100">
                    <IoInformationCircleOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Reason
                    </p>
                    <p className="font-bold text-slate-700">{ticket.reason}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                    <IoWalletOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Refund Amount
                    </p>
                    <p className="font-bold text-slate-700">{formatPrice(ticket.money)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-600 border border-slate-100">
                    <IoCubeOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Quantity
                    </p>
                    <p className="font-bold text-slate-700">
                      {ticket.quantity} {ticket.quantity > 1 ? 'items' : 'item'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600 border border-slate-100">
                    <IoTimeOutline size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Created At
                    </p>
                    <p className="font-bold text-slate-700">{ticket.createdAt}</p>
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span>Description</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed border border-slate-100 italic">
                  "{ticket.description}"
                </div>
              </div>

              {}
              {ticket.media && ticket.media.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span>Evidence</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ticket.media.map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Ticket not found</p>
            </div>
          )}
        </div>

        {}
        <div className="p-6 bg-slate-50/50 border-t border-slate-100 sticky bottom-0 z-10">
          <Button
            variant="solid"
            colorScheme="primary"
            isFullWidth
            className="rounded-2xl h-12 font-bold shadow-lg shadow-mint-100 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
            onClick={() => ticket && onViewFullDetails(ticket.id)}
            disabled={!ticket}
          >
            View Full Details
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
