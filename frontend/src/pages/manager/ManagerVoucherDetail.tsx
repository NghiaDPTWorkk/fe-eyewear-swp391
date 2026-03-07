import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IoArrowBackOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoTicketOutline,
  IoStatsChartOutline,
  IoInformationCircleOutline
} from 'react-icons/io5'
import type { Voucher, VoucherPayload } from '@/shared/types'
import { VoucherApplyScope, VoucherDiscountType } from '@/shared/utils/enums/voucher.enum'
import { VOUCHER_STATUS_CFG, fmtDate } from '@/components/layout/staff/managerstaff/vouchertable/VoucherTdata'
import {
  useVoucherDetail,
  useUpdateVoucher,
  useDeleteVoucher
} from '@/features/manager/hooks/useManagerVouchers'
import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition/VoucherAddition'
import VoucherTicket from '@/components/layout/staff/managerstaff/voucherticket/VoucherTicket'
import VoucherTicketSpecification from '@/components/layout/staff/managerstaff/voucherticket/VoucherTicketSpecification'
import MainDetailVoucher from '@/components/layout/staff/managerstaff/maindetailvoucher/MainDetailVoucher'
import { PATHS } from '@/routes/paths'
import { createPortal } from 'react-dom'

export default function ManagerVoucherDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // ── Queries / Mutations ──────────────────────────────────────────
  const { data: detailData, isLoading, isError } = useVoucherDetail(id || null)
  const updateMutation = useUpdateVoucher()
  const deleteMutation = useDeleteVoucher()

  const [v, setVoucher] = useState<Voucher | null>(null)

  useEffect(() => {
    if (detailData?.data?.voucher) {
      setVoucher(detailData.data.voucher)
    }
  }, [detailData])

  // ── Local state ──────────────────────────────────────────────────
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ── Handlers ──────────────────────────────────────────────────────
  const handleBack = () => {
    navigate(PATHS.MANAGER.VOUCHERS)
  }

  const handleSave = (formData: Partial<Voucher>) => {
    if (!v) return
    const payload: VoucherPayload = {
      name:             formData.name             ?? '',
      description:      formData.description      ?? '',
      code:             formData.code             ?? '',
      typeDiscount:     formData.typeDiscount      ?? 'PERCENTAGE',
      value:            formData.value             ?? 0,
      usageLimit:       formData.usageLimit        ?? 100,
      startedDate:      formData.startedDate       ?? '',
      endedDate:        formData.endedDate         ?? '',
      minOrderValue:    formData.minOrderValue      ?? 0,
      maxDiscountValue: formData.maxDiscountValue   ?? 0,
      applyScope:       formData.applyScope        ?? 'ALL',
      status:           formData.status            ?? 'DRAFT'
    }

    updateMutation.mutate(
      { id: v._id, payload },
      { onSuccess: (res) => { if (res.success) setShowEditForm(false) } }
    )
  }

  const handleDelete = () => {
    if (!v) return
    deleteMutation.mutate(v._id, {
      onSuccess: (res) => {
        if (res.success) {
          navigate(PATHS.MANAGER.VOUCHERS, { replace: true })
        }
      }
    })
  }

  // ── Render ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-mint-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !v) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <IoInformationCircleOutline size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Voucher Required</h2>
        <p className="text-slate-500 mt-2 mb-6">The requested voucher data could not be retrieved.</p>
        <button
          onClick={handleBack}
          className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Back to list
        </button>
      </div>
    )
  }

  const isPerc = v.typeDiscount === VoucherDiscountType.PERCENTAGE
  const st = VOUCHER_STATUS_CFG[v.status] ?? VOUCHER_STATUS_CFG['DISABLE']
  const usagePct = Math.min((v.usageCount / (v.usageLimit || 1)) * 100, 100)
  const isSaving = updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  return (
    <div className="animate-fade-in-up space-y-6 max-w-5xl mx-auto pb-24 relative">

      {/* ── Header Area: Focus on Code ─────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-4 w-full">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-mint-600 font-bold transition-all"
          >
            <IoArrowBackOutline size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Vouchers</span>
          </button>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPerc ? 'bg-mint-50 text-mint-600' : 'bg-blue-50 text-blue-600'} shadow-sm border border-slate-100/50`}>
                <IoTicketOutline size={32} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter font-mono bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  Voucher Code: {v.code}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-6 perspective-1000">
        <div className="animate-voucher-pop">
           {v.applyScope === VoucherApplyScope.ALL ? (
             <VoucherTicket voucher={v} />
           ) : (
             <VoucherTicketSpecification voucher={v} />
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Details Card (Refactored) ────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <MainDetailVoucher voucher={v} statusConfig={st} />
        </div>

        {/* ── Sidebar: Usage & Meta ─────────────────────────────── */}
        <div className="space-y-6">
           {/* Usage Metrics */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 animate-in slide-in-from-right-5 duration-500">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <IoStatsChartOutline className="text-mint-500" size={18} />
                    <h3 className="text-sm font-bold text-slate-800">Usage Analytics</h3>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-end justify-between">
                    <div>
                       <p className="text-3xl font-black text-slate-900 tracking-tight">{v.usageCount}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coupons Redeemed</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold text-slate-700">/ {v.usageLimit}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Pool</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <div
                          className="h-full bg-mint-500 transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${usagePct}%` }}
                       />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                       {Math.round(usagePct)}% Utilized
                    </p>
                 </div>
              </div>
           </div>

           {/* System Meta */}
           <div className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Properties</h4>
              <div className="space-y-3">
                 <MetaRow label="UUID" value={v._id} isMono />
                 <MetaRow label="Registered" value={fmtDate(v.createdAt)} />
                 <MetaRow label="Last Update" value={fmtDate(v.updatedAt)} />
              </div>
              <div className="pt-4 border-t border-slate-200">
                 <div className="flex items-center gap-2 text-mint-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-mint-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Verifying integrity...</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* ── Footer Actions: Permanent Placement ────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl p-3 rounded-[1rem] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-[2rem] text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
          >
            <IoTrashOutline size={20} />
            <span className="text-sm">Delete Voucher</span>
          </button>

          <button
            onClick={() => setShowEditForm(true)}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-[2rem] bg-mint-500 text-white text-sm font-black hover:bg-mint-600 transition-all active:scale-95 shadow-xl shadow-mint-200/50"
          >
            <IoCreateOutline size={20} />
            Modify Voucher
          </button>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}

      <VoucherAddition
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSave={handleSave}
        editingVoucher={v}
        isSaving={isSaving}
      />

      {showDeleteModal && (
        <DeleteModal
          isDeleting={isDeleting}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function MetaRow({ label, value, isMono = false }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{label}</span>
       <span className={`text-[10px] font-bold text-slate-600 truncate ${isMono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function DeleteModal({
  isDeleting,
  onCancel,
  onConfirm
}: {
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <IoTrashOutline size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900">Delete Voucher?</h2>
        <p className="text-sm text-slate-500 mt-2 mb-8">This action is permanent and cannot be reversed. Are you absolutely sure?</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-4 rounded-2xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Yes, Delete Voucher'}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full py-4 rounded-2xl bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
