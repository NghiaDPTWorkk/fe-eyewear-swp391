import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '@/shared/components/ui'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import {
  IoArrowBack,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoAlertCircleOutline
} from 'react-icons/io5'
import {
  usePreOrderImportDetail,
  useUpdatePreOrderImportStatus
} from '@/features/operations/hooks/usePreOrderImports'
import { useQuery } from '@tanstack/react-query'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import { useMemo } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// ─── Status Config ────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    icon: <IoTimeOutline size={16} />
  },
  DONE: {
    label: 'Done',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <IoCheckmarkCircleOutline size={16} />
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    icon: <IoCheckmarkCircleOutline size={16} /> // Adjust if needed
  }
}

export default function OperationInvenProcessPlan() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError } = usePreOrderImportDetail(receiptId || '')
  const updateStatus = useUpdatePreOrderImportStatus()

  const { data: staffData } = useQuery({
    queryKey: ['admin-accounts-list'],
    queryFn: () => adminAccountService.getAdminAccounts({ page: 1, limit: 100 }),
    staleTime: 5 * 60 * 1000
  })

  const detail = data?.data

  const staffMap = useMemo(() => {
    const map: Record<string, string> = {}
    staffData?.data.adminAccounts.forEach((acc) => {
      map[acc._id] = acc.name
    })
    return map
  }, [staffData])

  const handleConfirmDone = async () => {
    if (!receiptId) return
    if (
      window.confirm(
        'Are you sure you want to mark this batch as DONE? This action will update the inventory status.'
      )
    ) {
      await updateStatus.mutateAsync({ id: receiptId, status: 'DONE' })
    }
  }

  if (isError) {
    return (
      <Container className="pt-10">
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <IoAlertCircleOutline className="text-red-400 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-800">Batch Not Found</h3>
          <p className="text-sm text-slate-400 mt-1">
            The batch ID you provided does not exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/operationstaff/inventory-receiving')}
            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all"
          >
            Go Back to List
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="animate-fade-in-up pb-10">
      <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving', 'Process Plan']} />

      {/* ── Loading Overlay ── */}
      {(isLoading || updateStatus.isPending) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-6 select-none animate-in fade-in duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-mint-400 rounded-2xl blur-xl opacity-20 animate-pulse" />
            <div className="w-14 h-14 bg-mint-500 rounded-2xl flex items-center justify-center shadow-xl shadow-mint-200 relative z-10">
              <span className="text-white font-bold text-2xl leading-none">O</span>
            </div>
            <div className="absolute -inset-3 border-[3px] border-mint-100 border-t-mint-500 rounded-[22px] animate-spin duration-[2s]" />
            <div className="absolute -inset-3 border-[3px] border-transparent border-b-mint-300/30 rounded-[22px] animate-spin-reverse duration-[3s]" />
          </div>
          <div className="flex flex-col items-center gap-2 mt-2">
            <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase pl-[0.4em]">
              OpticView
            </h3>
            <div className="flex items-center gap-1.5 opacity-40">
              <span className="w-1 h-1 bg-mint-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-mint-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/operationstaff/inventory-receiving')}
            className="p-2.5 rounded-2xl border border-slate-200 text-slate-400 hover:text-mint-600 hover:border-mint-200 hover:bg-mint-50 transition-all shadow-sm active:scale-95"
          >
            <IoArrowBack size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Process Inventory Plan
              </h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Verification and confirmation of batch inventory status.
            </p>
          </div>
        </div>
        {detail && (
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.bg} ${STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.color}`}
          >
            {detail.status}
          </span>
        )}
      </div>

      {detail && (
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-50/50 rounded-bl-full -z-0" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  <IoCubeOutline size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Product Information
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                      {detail.sku}
                    </p>
                    <p className="text-sm text-slate-400 font-medium">{detail.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">
                      Inventory Plan ID
                    </p>
                    <p className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {detail._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Tracker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Expected Quantity
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">
                      {detail.targetQuantity}
                    </span>
                    <span className="text-xs font-bold text-slate-400">units</span>
                  </div>
                </div>
              </div>
              <div className="bg-mint-50 rounded-[32px] border border-mint-100 shadow-sm p-8">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-mint-600 uppercase tracking-widest">
                    Actually Pre-Ordered
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-mint-600">
                      {detail.preOrderedQuantity}
                    </span>
                    <span className="text-xs font-bold text-mint-400">units</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instruction / Note Section */}
            <div className="bg-mint-600 rounded-[20px] p-8 text-white">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <IoAlertCircleOutline className="text-mint-400" />
                Inventory Guidelines
              </h4>
              <ul className="space-y-3 text-sm text-white-400">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>
                    Ensure all items are physically verified before marking as <b>DONE</b>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>
                    The current batch has a fill rate of{' '}
                    <b>{Math.round((detail.preOrderedQuantity / detail.targetQuantity) * 100)}%</b>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-mint-400 mt-1.5 shrink-0" />
                  <span>
                    Marking as DONE will notify the system to update available stock for order
                    fulfillment.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Responsibility */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 opacity-60">
                <IoPersonOutline size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Management</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-mint-500 rounded-2xl flex items-center justify-center text-white font-black">
                  {staffMap[detail.managerResponsibility]?.slice(0, 2).toUpperCase() || '??'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {staffMap[detail.managerResponsibility] || 'Unknown Manager'}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">Head of This Batch</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 opacity-60">
                <IoCalendarOutline size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">Started At</span>
                  <span className="text-slate-700 font-bold">{formatDate(detail.startedDate)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">End Date</span>
                  <span className="text-slate-700 font-bold">{formatDate(detail.endedDate)}</span>
                </div>
                <div className="pt-4 border-t border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">Target Date</span>
                    <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-black text-slate-800">
                      {formatDate(detail.targetDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {detail && detail.status === 'PENDING' && (
              <button
                onClick={handleConfirmDone}
                className="flex items-center gap-2 px-8 py-3 bg-mint-600 text-white rounded-2xl font-bold border-b-4 border-mint-700 shadow-xl shadow-mint-100 hover:bg-mint-900 hover:translate-y-[1px] hover:border-b-2 transition-all active:translate-y-[4px] active:border-b-0"
              >
                Confirm All Received
              </button>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}
