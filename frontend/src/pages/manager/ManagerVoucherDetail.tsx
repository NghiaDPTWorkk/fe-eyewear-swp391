import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IoArrowBackOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoTicketOutline,
  IoCalendarOutline,
  IoInfiniteOutline,
  IoPricetagOutline,
  IoGlobeOutline
} from 'react-icons/io5'
import type { Voucher, VoucherPayload } from '@/shared/types'
import { VoucherDiscountType } from '@/shared/utils/enums/voucher.enum'
import { VOUCHER_STATUS_CFG, fmtVND, fmtDate } from '@/components/layout/staff/managerstaff/vouchertable/VoucherTdata'
import {
  useVoucherDetail,
  useUpdateVoucher,
  useDeleteVoucher
} from '@/features/manager/hooks/useManagerVouchers'
import { VoucherAddition } from '@/components/layout/staff/managerstaff/voucheraddition/VoucherAddition'
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
    if (detailData?.data) {
      setVoucher(detailData.data)
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
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-mint-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !v) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 font-medium">Voucher not found or an error occurred.</p>
        <button
          onClick={handleBack}
          className="mt-4 text-mint-600 font-bold hover:underline"
        >
          Back to Vouchers
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
    <div className="animate-fade-in-up space-y-6 max-w-4xl mx-auto pb-10">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold transition-colors"
        >
          <IoArrowBackOutline size={18} />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-red-500 text-sm font-bold hover:border-red-300 hover:bg-red-50 transition-all active:scale-95"
          >
            <IoTrashOutline size={16} />
            Delete
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition-all active:scale-95 shadow-lg shadow-mint-200"
          >
            <IoCreateOutline size={18} />
            Edit Voucher
          </button>
        </div>
      </div>

      {/* ── Main Card ───────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${isPerc ? 'bg-mint-100 text-mint-600' : 'bg-violet-100 text-violet-600'}`}>
              {isPerc ? '%' : '₫'}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <IoTicketOutline className="text-slate-400" size={20} />
                {v.name}
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <p className="font-mono text-sm font-black text-slate-500">{v.code}</p>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${st.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">

          {v.description && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {v.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Discount info */}
            <Section title="Discount Details">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IoPricetagOutline size={12} /> Type
                  </p>
                  <p className="text-sm font-bold text-slate-700">{isPerc ? 'Percentage (%)' : 'Fixed Amount (₫)'}</p>
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    {isPerc ? <span className="text-mint-600 font-bold">%</span> : <span className="text-violet-600 font-bold">₫</span>} Value
                  </p>
                  <p className={`text-xl font-black ${isPerc ? 'text-mint-600' : 'text-violet-600'}`}>
                    {isPerc ? `${v.value}%` : `${fmtVND(v.value)}₫`}
                  </p>
                </div>
                {isPerc && v.maxDiscountValue > 0 && (
                  <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100 mt-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max discount cap</p>
                    <p className="text-sm font-bold text-slate-700">{fmtVND(v.maxDiscountValue)}₫</p>
                  </div>
                )}
                {v.minOrderValue > 0 && (
                  <div className="space-y-1 col-span-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minimum order value</p>
                    <p className="text-sm font-bold text-slate-700">{fmtVND(v.minOrderValue)}₫</p>
                  </div>
                )}
              </div>
            </Section>

            {/* Scope & Usage */}
            <Section title="Scope & Usage">
              <div className="space-y-5 mt-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <IoGlobeOutline size={12} /> Apply Scope
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {v.applyScope === 'ALL' ? 'Public — All Users' : 'Targeted — Specific Users'}
                  </p>
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <IoInfiniteOutline size={12} /> Usage
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {v.usageCount} <span className="text-slate-400 font-medium">/ {v.usageLimit}</span>
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${usagePct >= 100 ? 'bg-red-400' : usagePct >= 75 ? 'bg-amber-400' : 'bg-mint-400'}`}
                      style={{ width: `${usagePct}%` }}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Validity */}
            <Section title="Validity Period">
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="text-mint-500" size={16} />
                    <p className="text-xs font-bold text-slate-500">From</p>
                  </div>
                  <p className="text-sm font-black text-slate-800">{fmtDate(v.startedDate)}</p>
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="text-amber-500" size={16} />
                    <p className="text-xs font-bold text-slate-500">Until</p>
                  </div>
                  <p className="text-sm font-black text-slate-800">{fmtDate(v.endedDate)}</p>
                </div>
              </div>
            </Section>

            {/* System Info */}
            <Section title="System Information">
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</p>
                  <p className="text-xs font-mono font-bold text-slate-500">{v._id}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Created At</p>
                  <p className="text-xs font-bold text-slate-500">{fmtDate(v.createdAt)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updated At</p>
                  <p className="text-xs font-bold text-slate-500">{fmtDate(v.updatedAt)}</p>
                </div>
              </div>
            </Section>

          </div>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────── */}

      {/* Edit Form */}
      <VoucherAddition
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSave={handleSave}
        editingVoucher={v}
        isSaving={isSaving}
      />

      {/* Delete Confirmation */}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-3">
        {title}
      </h3>
      {children}
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
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[3px]" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
          <IoTrashOutline className="text-red-400" size={26} />
        </div>
        <h2 className="text-base font-black text-slate-900 mb-1">Delete Voucher?</h2>
        <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-black hover:bg-red-600 transition disabled:opacity-60 flex items-center gap-2"
          >
            {isDeleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
