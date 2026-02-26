import { IoCloseOutline } from 'react-icons/io5'

interface TicketDetailsModalProps {
  ticket: any
  isOpen: boolean
  onClose: () => void
  accentColor?: string
}

export function TicketDetailsModal({
  ticket,
  isOpen,
  onClose,
  accentColor = 'mint'
}: TicketDetailsModalProps) {
  if (!isOpen || !ticket) return null

  const statusClass = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-100'
      case 'RESOLVED':
      case 'COMPLETED':
      case 'DONE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default:
        return accentColor === 'mint'
          ? 'bg-mint-50 text-mint-600 border-mint-100'
          : 'bg-primary-50 text-primary-600 border-primary-100'
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-neutral-50/50">
          <h3 className="text-lg font-semibold text-slate-800 tracking-tight">Report Detail</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-200/50 text-slate-500 transition-colors cursor-pointer"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Title
            </h4>
            <p className="text-xl text-slate-900 font-semibold break-all whitespace-pre-wrap">
              {ticket.title}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-5 bg-neutral-50/50 rounded-2xl border border-neutral-100">
            <div>
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Priority
              </h4>
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border inline-flex ${
                  ticket.priorityLevel === 'HIGH'
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : ticket.priorityLevel === 'MEDIUM'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}
              >
                {ticket.priorityLevel}
              </span>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Status
              </h4>
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border inline-flex ${statusClass(ticket.status)}`}
              >
                {ticket.status}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Time
              </h4>
              <p className="text-sm text-slate-700 font-medium">{ticket.createdAt}</p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Description
            </h4>
            <div className="p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm leading-relaxed text-slate-700 text-sm whitespace-pre-wrap break-all min-h-[100px]">
              {ticket.description}
            </div>
          </div>

          {ticket.imageUrl && (
            <div>
              <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Attachment
              </h4>
              <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                <img
                  src={ticket.imageUrl}
                  alt="Attachment"
                  className="w-full h-auto object-contain max-h-[400px] bg-neutral-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
