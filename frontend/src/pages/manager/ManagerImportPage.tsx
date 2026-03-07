import { useState } from 'react'
import { format } from 'date-fns'
import { Container } from '@/components'
import { PageHeader } from '@/features/sales/components/common'
import { usePreOrderImports } from '@/features/manager/hooks/usePreOrderImports'
import {
  IoCubeOutline,
  IoRefreshOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoArrowDownOutline
} from 'react-icons/io5'
import { ImportProductModal } from './components/ImportProductModal'
import type { PreOrderImport } from '@/shared/types'


export default function ManagerImportPage() {
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, refetch } = usePreOrderImports(page, limit)

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PreOrderImport | null>(null)

  const plans = data?.data?.preOrderImports ?? []
  const pagination = data?.data?.pagination

  const handleOpenImport = (plan: PreOrderImport) => {
    setSelectedPlan(plan)
    setIsImportModalOpen(true)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
      default:
        return 'bg-slate-50 text-slate-600 ring-1 ring-slate-100'
    }
  }

  return (
    <Container className="max-w-none space-y-8">
      <PageHeader
        title="Import Management"
        subtitle="Manage pre-order import plans and track physical stock arrivals."
        breadcrumbs={[
          { label: 'Dashboard', path: '/manager/dashboard' },
          { label: 'Inventory', path: '/manager/products' },
          { label: 'Imports' }
        ]}
      />

      <div className="bg-white rounded-[40px] border-none shadow-sm ring-1 ring-neutral-100/50 overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Active Plans
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {pagination?.total ?? '—'}
              </h2>
              <span className="text-sm font-bold text-slate-400">total import plans</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center justify-center gap-2 px-5 h-12 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-mint-600 hover:border-mint-200 hover:bg-mint-50/30 transition-all active:scale-95"
            >
              <IoRefreshOutline size={20} />
              <span className="text-xs font-bold">Refresh Data</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-mint-100 border-t-mint-600 rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">
              Loading import plans...
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <IoCubeOutline size={40} className="opacity-20" />
            </div>
            <p className="text-lg font-bold text-slate-400 mb-2">No Import Plans Found</p>
            <p className="text-sm font-medium text-slate-300">
              Create a pre-order product to generate new plans.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-bold tracking-widest uppercase border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Product Info</th>
                  <th className="px-8 py-5">Target Status</th>
                  <th className="px-8 py-5">Plan Timeline</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map((plan) => (
                  <tr
                    key={plan._id}
                    className="group hover:bg-slate-50/30 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                          <IoCubeOutline
                            className="text-slate-400 group-hover:text-mint-600 transition-colors"
                            size={24}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold text-mint-600 uppercase tracking-widest mb-0.5">
                            SKU Identifier
                          </p>
                          <p className="text-[15px] font-bold text-slate-800 truncate leading-tight">
                            {plan.sku}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-1 italic">
                            {plan.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-3 max-w-[160px]">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-400 tracking-wider">RECEIVED</span>
                          <span className="font-extrabold text-slate-700">
                            {plan.preOrderedQuantity} / {plan.targetQuantity}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-200/50">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out-expo ${
                              plan.preOrderedQuantity / plan.targetQuantity >= 1
                                ? 'bg-mint-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                : 'bg-mint-500/60'
                            }`}
                            style={{
                              width: `${Math.min(100, (plan.preOrderedQuantity / plan.targetQuantity) * 100)}%`
                            }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-right">
                          {Math.round((plan.preOrderedQuantity / plan.targetQuantity) * 100)}%
                          Complete
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-500">
                          <IoTimeOutline size={14} className="text-slate-300" />
                          <span className="text-[11px] font-bold tracking-tight">
                            Started: {format(new Date(plan.startedDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <IoCalendarOutline size={14} className="text-slate-300" />
                          <span className="text-[11px] font-bold tracking-tight text-amber-600/80">
                            Due: {format(new Date(plan.endedDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-widest uppercase ${getStatusStyle(plan.status)}`}
                      >
                        {plan.status === 'DONE' ? (
                          <IoCheckmarkCircleOutline size={14} />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => handleOpenImport(plan)}
                        disabled={plan.status === 'DONE'}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-extrabold text-white bg-mint-600 hover:bg-mint-700 shadow-lg shadow-mint-100 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed group/btn"
                      >
                        <IoArrowDownOutline
                          size={14}
                          className="group-hover/btn:translate-y-0.5 transition-transform"
                        />
                        Import Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing Page <span className="text-slate-900">{pagination.page}</span> of{' '}
              <span className="text-slate-900">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-mint-600 hover:border-mint-200 hover:bg-mint-50 transition-all disabled:opacity-20"
              >
                <IoChevronBackOutline size={20} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-mint-600 hover:border-mint-200 hover:bg-mint-50 transition-all disabled:opacity-20"
              >
                <IoChevronForwardOutline size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ImportProductModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
      />
    </Container>
  )
}
