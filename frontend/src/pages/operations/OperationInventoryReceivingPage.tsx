import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, MetricCard, Pagination } from '@/shared/components/ui'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import {
  IoArchiveOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoFilterOutline,
  IoChevronForward,
  IoStatsChartOutline,
  IoCloseOutline
} from 'react-icons/io5'
import { usePreOrderImports, usePreOrderImportDetail } from '@/features/operations/hooks/usePreOrderImports'
import { useQuery } from '@tanstack/react-query'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'

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
    icon: <IoTimeOutline size={14} />,
    dot: 'bg-amber-400'
  },
  DONE: {
    label: 'Done',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    icon: <IoCheckmarkCircleOutline size={14} />,
    dot: 'bg-emerald-400'
  }
}

// ─── Detail Modal ────────────────────────────────────────────────
function DetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = usePreOrderImportDetail(id)
  const detail = data?.data

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
         <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Batch Detail Information</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
               <IoCloseOutline size={24} />
            </button>
         </div>

         <div className="p-6">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-10 h-10 border-4 border-mint-100 border-t-mint-500 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fetching Data...</p>
               </div>
            ) : detail ? (
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product SKU</p>
                        <p className="text-sm font-mono font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded inline-block">{detail.sku}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.bg} ${STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.color}`}>
                            {detail.status}
                        </span>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                     <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                        {detail.description || 'No description provided.'}
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 border-t border-slate-50 pt-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Quantity</p>
                        <p className="text-xl font-black text-slate-800">{detail.targetQuantity} units</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Pre-orders</p>
                        <p className="text-xl font-black text-mint-600">{detail.preOrderedQuantity} units</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Start Date</p>
                        <p className="text-sm font-bold text-slate-700">{formatDate(detail.startedDate)}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End Date</p>
                        <p className="text-sm font-bold text-slate-700">{formatDate(detail.endedDate)}</p>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="text-center py-10 text-slate-400">Failed to load detail.</div>
            )}
         </div>

         <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
            <button
               onClick={onClose}
               className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
            >
               Close Information
            </button>
         </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────
export default function OperationInventoryReceivingPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['PENDING', 'DONE'])
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null)

  // Fetch Imports
  const { data, isLoading } = usePreOrderImports({
    page,
    limit,
    status: statusFilter,
    search: search.trim() || undefined
  })

  // Fetch Staff to map name
  const { data: staffData } = useQuery({
    queryKey: ['admin-accounts-list'],
    queryFn: () => adminAccountService.getAdminAccounts({ page: 1, limit: 100 }),
    staleTime: 5 * 60 * 1000
  })

  const results = data?.data?.preOrderImports || []
  const pagination = data?.data?.pagination

  // Build ID-to-Name map
  const staffMap = useMemo(() => {
    const map: Record<string, string> = {}
    staffData?.data.adminAccounts.forEach((acc) => {
      map[acc._id] = acc.name
    })
    return map
  }, [staffData])

  const stats = useMemo(() => {
    const total = pagination?.total || 0
    return { total }
  }, [pagination])

  return (
    <Container className="animate-fade-in-up pb-10">
      <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving']} />

      {/* ── Header & Title ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-mint-500 rounded-2xl shadow-lg shadow-mint-100/50">
              <IoArchiveOutline className="text-white" size={28} />
            </div>
            Inventory Receiving
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Manage and track pre-order import batches for efficient stock replenishment.
          </p>
        </div>
      </div>

      {/* ── Loading Overlay (Branded) ── */}
      {isLoading && (
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

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <MetricCard
          label="Total Batches"
          value={isLoading ? '...' : stats.total}
          icon={<IoStatsChartOutline size={22} />}
          colorScheme="mint"
          subValue="Active & Completed"
        />
        <MetricCard
          label="Pending Imports"
          value={isLoading ? '...' : results.filter(r => r.status === 'PENDING').length}
          icon={<IoTimeOutline size={22} />}
          colorScheme="warning"
          subValue="Awaiting receiving"
        />
        <MetricCard
          label="Done / Completed"
          value={isLoading ? '...' : results.filter(r => r.status === 'DONE').length}
          icon={<IoCheckmarkCircleOutline size={22} />}
          colorScheme="success"
          subValue="Finished batches"
        />
      </div>

      {/* ── Filters Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <IoSearchOutline
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by SKU or responsibility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-mint-500/10 focus:border-mint-500 transition-all font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
             <IoFilterOutline className="text-slate-400" size={16} />
             <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Status:</span>
             <div className="flex gap-1">
                {['PENDING', 'DONE'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                        const newFilter = statusFilter.includes(s) 
                            ? statusFilter.filter(f => f !== s)
                            : [...statusFilter, s]
                        if (newFilter.length > 0) setStatusFilter(newFilter)
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      statusFilter.includes(s)
                        ? 'bg-mint-500 border-mint-500 text-white shadow-sm shadow-mint-100'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-mint-200 hover:text-mint-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {results.length} results found
        </div>
      </div>

      {/* ── Data Table / List ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
        {results.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <IoArchiveOutline className="text-slate-200" size={40} />
            </div>
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">No batches found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    ID
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    MANAGER RESPONSIBILITY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    TARGET QTY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    PERIOD
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((batch) => {
                  const config = STATUS_CONFIG[batch.status as keyof typeof STATUS_CONFIG]

                  return (
                    <tr
                      key={batch._id}
                      className="group transition-all duration-300 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-5">
                        <div className="text-[12px] font-bold text-slate-800 text-center uppercase tracking-tighter">
                          {batch._id}
                        </div>
                      </td>
                      
                      <td className="px-6 py-5">
                         <div className="flex justify-center">
                            <span className="font-mono text-[13px] font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              {batch.sku}
                            </span>
                         </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-[13px] text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
                          {staffMap[batch.managerResponsibility] || batch.managerResponsibility || 'Unassigned'}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="text-[13px] font-black text-slate-800 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 inline-block min-w-[50px]">
                           {batch.targetQuantity}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5 items-center">
                          <span className="text-[11px] font-medium text-slate-400">{formatDate(batch.startedDate)}</span>
                          <span className="text-[11px] font-bold text-slate-700">→ {formatDate(batch.endedDate)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color} border shadow-sm`}>
                          {config.label}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                           <button
                             onClick={() => setSelectedDetailId(batch._id)}
                             className="p-1.5 rounded-lg text-slate-400 bg-white border border-slate-200 hover:text-mint-600 hover:border-mint-200 hover:bg-mint-50 transition-all shadow-sm"
                             title="Quick View"
                           >
                             <IoEyeOutline size={18} />
                           </button>
                           <button
                             onClick={() => navigate(`/operationstaff/inventory-receiving/${batch._id}`)}
                             className="p-1.5 rounded-lg text-white bg-mint-500 hover:bg-mint-600 transition-all shadow-md shadow-mint-100 active:scale-95"
                             title="Process Plan"
                           >
                             <IoChevronForward size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* ── Detail Portal ── */}
      {selectedDetailId && (
        <DetailModal id={selectedDetailId} onClose={() => setSelectedDetailId(null)} />
      )}
    </Container>
  )
}
