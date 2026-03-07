import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IoArrowBackOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoTicketOutline,
  IoCalendarOutline,
  IoPricetagOutline,
  IoGlobeOutline,
  IoStatsChartOutline,
  IoInformationCircleOutline
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
    <div className="animate-fade-in-up space-y-6 max-w-5xl mx-auto pb-10">

      {/* ── Header Area ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-mint-600 font-bold transition-all mb-1"
          >
            <IoArrowBackOutline size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Vouchers</span>
          </button>
          <div className="flex items-center gap-3">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPerc ? 'bg-mint-50 text-mint-600' : 'bg-blue-50 text-blue-600'}`}>
                <IoTicketOutline size={28} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {v.name}
                </h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{v.code}</span>
                  <span className="text-slate-300">·</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${st.pill}`}>
                    <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm font-bold hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all active:scale-95"
          >
            <IoTrashOutline size={18} />
            Delete
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-mint-500 text-white text-sm font-bold hover:bg-mint-600 transition-all active:scale-95 shadow-lg shadow-mint-100"
          >
            <IoCreateOutline size={18} />
            Edit Voucher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main Details Card ─────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            <div className="p-8 space-y-8">

              {/* Value Highlight */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="space-y-4">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotion Logic</p>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {isPerc ? `Get ${v.value}% off your purchase` : `Save ${fmtVND(v.value)}đ on your order`}
                      </h3>
                   </div>
                   <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                      {v.description || "This voucher applies a discount based on the specific campaign rules defined below."}
                   </p>
                </div>
                <div className={`px-8 py-4 rounded-2xl text-center border-2 ${isPerc ? 'bg-mint-50 border-mint-100 text-mint-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                   <p className="text-4xl font-black tracking-tight leading-none">
                      {isPerc ? `${v.value}%` : fmtVND(v.value)}
                      {!isPerc && <span className="text-xl ml-1 font-bold">đ</span>}
                   </p>
                   <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Value</p>
                </div>
              </div>

              {/* Specific Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <DetailGroup
                    icon={<IoPricetagOutline className="text-amber-500" />}
                    title="Order Requirements"
                    items={[
                      { label: "Minimum Spend", value: `${fmtVND(v.minOrderValue)}đ` },
                      { label: "Maximum Discount", value: v.maxDiscountValue > 0 ? `${fmtVND(v.maxDiscountValue)}đ` : "No limit" }
                    ]}
                 />
                 <DetailGroup
                    icon={<IoGlobeOutline className="text-blue-500" />}
                    title="Accessibility"
                    items={[
                      { label: "Apply Scope", value: v.applyScope === 'ALL' ? 'Open to everyone' : 'Targeted users only' },
                      { label: "Visibility", value: 'Publicly listed' }
                    ]}
                 />
              </div>

              {/* Validity Section */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                   <IoCalendarOutline className="text-indigo-500" size={18} />
                   <h3 className="text-sm font-bold text-slate-800">Validity Period</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active From</p>
                         <p className="text-sm font-bold text-slate-700">{fmtDate(v.startedDate)}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expires On</p>
                         <p className="text-sm font-bold text-slate-700">{fmtDate(v.endedDate)}</p>
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>
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

function DetailGroup({ icon, title, items }: { icon: React.ReactNode; title: string; items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-4">
       <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h4>
       </div>
       <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
               <span className="text-sm font-bold text-slate-700">{item.value}</span>
            </div>
          ))}
       </div>
    </div>
  )
}

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
