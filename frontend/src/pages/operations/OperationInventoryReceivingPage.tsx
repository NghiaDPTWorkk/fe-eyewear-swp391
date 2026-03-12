import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Container, OperationPagination, Button } from '@/components'
import { BreadcrumbPath } from '@/components/layout/staff/operationstaff/breadcrumbpath'
import { FilterButtonList } from '@/components/staff'
import { IoEyeOutline, IoTimeOutline, IoChevronForward, IoCloseOutline } from 'react-icons/io5'
import {
  usePreOrderImports,
  usePreOrderImportDetail
} from '@/features/operations/hooks/usePreOrderImports'
import { useQuery } from '@tanstack/react-query'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatTime(iso: string) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ─── Status Config ────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: 'PENDING',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200'
  },
  DONE: {
    label: 'COMPLETED',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200'
  }
}

// ─── Detail Modal ────────────────────────────────────────────────
function DetailModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = usePreOrderImportDetail(id)
  const detail = data?.data

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Batch Information</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Full detailed overview of pre-order batch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all text-slate-400"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-[5px] border-mint-100 border-t-mint-500 rounded-full animate-spin" />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Synchronizing Data
              </p>
            </div>
          ) : detail ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Product SKU
                  </p>
                  <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                    <p className="text-sm font-mono font-black text-slate-900">{detail.sku}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Status
                  </p>
                  <div
                    className={`px-4 py-3 rounded-2xl border ${STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.bg}`}
                  >
                    <span
                      className={cn(
                        'text-[11px] font-black uppercase tracking-widest flex items-center gap-2',
                        STATUS_CONFIG[detail.status as keyof typeof STATUS_CONFIG]?.color
                      )}
                    >
                      {detail.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Batch Description
                </p>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 min-h-[80px]">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                    {detail.description || 'No additional information available for this batch.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white border-2 border-slate-50 p-6 rounded-[32px] flex flex-col gap-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Expected Goal
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      {detail.targetQuantity}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">units</span>
                  </div>
                </div>
                <div className="bg-mint-50 border border-mint-100 p-6 rounded-[32px] flex flex-col gap-1">
                  <p className="text-[10px] font-black text-mint-600 uppercase tracking-widest">
                    Pre-Ordered
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-mint-600">
                      {detail.preOrderedQuantity}
                    </span>
                    <span className="text-xs font-bold text-mint-400 uppercase">units</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex-1 space-y-1 text-center border-r border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Started from
                  </p>
                  <p className="text-xs font-bold text-slate-700">
                    {formatDate(detail.startedDate)}
                  </p>
                </div>
                <div className="flex-1 space-y-1 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Estimated end
                  </p>
                  <p className="text-xs font-bold text-slate-700">{formatDate(detail.endedDate)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-sm">
              Entity data stream failed.
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-800 uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-[0.98]"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────
export default function OperationInventoryReceivingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null)

  // Fetch Imports
  const { data, isLoading, isError } = usePreOrderImports({
    page: currentPage,
    limit,
    status: filter === 'all' ? ['PENDING', 'DONE'] : [filter]
  })

  // Fetch all for counts
  const { data: allData } = usePreOrderImports({
    page: 1,
    limit: 1000,
    status: ['PENDING', 'DONE']
  })
  const allBatches = allData?.data?.preOrderImports || []

  const results = data?.data?.preOrderImports || []
  const pagination = data?.data?.pagination

  // Fetch Staff to map name
  const { data: staffData } = useQuery({
    queryKey: ['admin-accounts-list'],
    queryFn: () => adminAccountService.getAdminAccounts({ page: 1, limit: 100 }),
    staleTime: 5 * 60 * 1000
  })

  const staffMap = useMemo(() => {
    const map: Record<string, string> = {}
    staffData?.data.adminAccounts.forEach((acc) => {
      map[acc._id] = acc.name
    })
    return map
  }, [staffData])

  const setFilter = (value: string) => {
    setCurrentPage(1)
    if (value === 'all') setSearchParams({})
    else setSearchParams({ filter: value })
  }

  const filterButtons = [
    { label: 'All', count: allBatches.length, value: 'all' },
    {
      label: 'Pending',
      count: allBatches.filter((b) => b.status === 'PENDING').length,
      value: 'PENDING'
    },
    {
      label: 'Completed',
      count: allBatches.filter((b) => b.status === 'DONE').length,
      value: 'DONE'
    }
  ]

  return (
    <Container>
      {/* Header */}
      <div className="mb-8">
        <BreadcrumbPath paths={['Dashboard', 'Inventory Receiving']} />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          Inventory Receiving
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and track pre-order import batches for efficient stock replenishment.
        </p>
      </div>

      <FilterButtonList
        buttons={filterButtons}
        selectedValue={filter}
        onChange={setFilter}
        className="mb-6"
      />

      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-neutral-100" />
              <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-mint-500 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-neutral-700">Loading receiving plans...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-500 font-semibold">
            Failed to load data.
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-neutral-400">
            No receiving plans found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    MANAGER
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    TARGET QTY
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    CREATED AT
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((batch) => {
                  const config = STATUS_CONFIG[batch.status as keyof typeof STATUS_CONFIG]
                  return (
                    <tr key={batch._id} className="group hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-gray-900">{batch.sku}</div>
                        <div className="w-12 mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-3/4 rounded-full"></div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-gray-400 text-sm">
                          {staffMap[batch.managerResponsibility] || 'Unassigned'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="text-gray-900 font-medium">{batch.targetQuantity}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
                            config.bg,
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-500">
                        <div className="flex items-center justify-center gap-1.5">
                          <IoTimeOutline />
                          <div className="flex flex-col text-[13px]">
                            <span>{formatTime(batch.createdAt)}</span>
                            <span>{formatDate(batch.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            colorScheme="secondary"
                            className="p-2"
                            onClick={() => setSelectedDetailId(batch._id)}
                          >
                            <IoEyeOutline size={20} />
                          </Button>
                          <Button
                            variant="solid"
                            colorScheme="primary"
                            size="sm"
                            className="text-xs rounded-xl h-8 px-4 font-bold"
                            rightIcon={<IoChevronForward />}
                            onClick={() =>
                              navigate(`/operationstaff/inventory-receiving/${batch._id}`)
                            }
                          >
                            Next
                          </Button>
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

      {pagination && pagination.totalPages > 1 && (
        <OperationPagination
          page={currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={limit}
          itemsOnPage={results.length}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedDetailId && (
        <DetailModal id={selectedDetailId} onClose={() => setSelectedDetailId(null)} />
      )}
    </Container>
  )
}
