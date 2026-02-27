import {
  IoCloseOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5'

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

  const statusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          border: 'border-amber-100',
          icon: <IoTimeOutline className="text-amber-500" />
        }
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-100',
          icon: <IoTimeOutline className="text-blue-500 animate-pulse" />
        }
      case 'REJECTED':
      case 'CANCELLED':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          border: 'border-rose-100',
          icon: <IoAlertCircleOutline className="text-rose-500" />
        }
      case 'RESOLVED':
      case 'COMPLETED':
      case 'DONE':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-600',
          border: 'border-emerald-100',
          icon: <IoCheckmarkCircleOutline className="text-emerald-500" />
        }
      default:
        return {
          bg: accentColor === 'mint' ? 'bg-mint-50' : 'bg-primary-50',
          text: accentColor === 'mint' ? 'text-mint-600' : 'text-primary-600',
          border: accentColor === 'mint' ? 'border-mint-100' : 'border-primary-100',
          icon: null
        }
    }
  }

  const status = statusConfig(ticket.status)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-300">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 px-8 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${status.bg} ${status.text}`}>{status.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Support Ticket Detail
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {ticket.id || 'REPORTED BUG'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Title Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] px-1">
              Subject
            </span>
            <h4 className="text-2xl font-bold text-slate-900 leading-tight">{ticket.title}</h4>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Priority
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ticket.priorityLevel === 'HIGH'
                      ? 'bg-rose-500'
                      : ticket.priorityLevel === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                  }`}
                />
                <span className="text-xs font-bold text-slate-700">{ticket.priorityLevel}</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </span>
              <span className={`text-xs font-bold ${status.text}`}>{ticket.status}</span>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col gap-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Created At
              </span>
              <span className="text-xs font-bold text-slate-700">{ticket.createdAt}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Detailed Description
              </span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm leading-relaxed text-slate-700 text-sm whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Image Attachment */}
          {ticket.imageUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Visual Evidence
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-md group relative bg-neutral-900">
                <img
                  src={ticket.imageUrl}
                  alt="Bug attachment"
                  className="w-full h-auto object-contain max-h-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <p className="text-white text-xs font-medium">Visual Evidence Attachment</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 px-8 border-t border-slate-100 bg-slate-50/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  )
}
