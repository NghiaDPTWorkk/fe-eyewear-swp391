import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  IoTicketOutline,
  IoInfiniteOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoCashOutline
} from 'react-icons/io5'
import type { Voucher, VoucherDiscountType, VoucherApplyScope, VoucherStatus } from '@/shared/types'
import {
  VoucherDiscountType as DiscountType,
  VoucherApplyScope as ApplyScope,
  VoucherStatus as Status
} from '@/shared/utils/enums/voucher.enum'

/**
 * Human-readable labels for each ApplyScope enum value.
 * Add a new key here whenever the backend adds a new scope — no changes elsewhere needed.
 */
const APPLY_SCOPE_LABELS: Record<string, string> = {
  [ApplyScope.ALL]:      'Public — All Users',
  [ApplyScope.SPECIFIC]: 'Targeted — Specific Users'
}

/**
 * Status display config — driven from the Status enum so new values auto-appear.
 */
const STATUS_CFG: Record<string, { label: string; active: string; idle: string }> = {
  [Status.DRAFT]:   { label: 'Draft',    active: 'bg-amber-50 border-amber-400 text-amber-700',  idle: 'border-slate-200 text-slate-400' },
  [Status.ACTIVE]:  { label: 'Active',   active: 'bg-emerald-50 border-emerald-400 text-emerald-700', idle: 'border-slate-200 text-slate-400' },
  [Status.DISABLE]: { label: 'Disabled', active: 'bg-slate-100 border-slate-400 text-slate-600', idle: 'border-slate-200 text-slate-400' }
}

// ─── Form state (mirrors Voucher but only editable fields) ────────
interface FormState {
  _id?: string
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number
  usageLimit: number
  startedDate: string
  endedDate: string
  minOrderValue: number
  maxDiscountValue: number
  applyScope: VoucherApplyScope
  status: VoucherStatus
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  code: '',
  typeDiscount: DiscountType.PERCENTAGE,
  value: 0,
  usageLimit: 100,
  startedDate: '',
  endedDate: '',
  minOrderValue: 0,
  maxDiscountValue: 0,
  applyScope: ApplyScope.ALL,
  status: Status.DRAFT
}

/**
 * Converts an ISO datetime string ("2026-01-01T00:00:00.000Z")
 * to the "YYYY-MM-DD" format that <input type="date"> requires.
 * Returns '' for falsy inputs.
 */
function isoToDateInput(iso: string | undefined | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

interface VoucherAdditionProps {
  isOpen: boolean
  onClose: () => void
  onSave: (voucher: Partial<Voucher>) => void
  editingVoucher: Voucher | null
  /** Pass true while the parent mutation is in-flight to disable the Save button */
  isSaving?: boolean
}

// ─── Component ────────────────────────────────────────────────────
export const VoucherAddition: React.FC<VoucherAdditionProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVoucher,
  isSaving = false
}) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  useEffect(() => {
    if (editingVoucher) {
      setForm({
        _id:              editingVoucher._id,
        name:             editingVoucher.name             ?? '',
        description:      editingVoucher.description      ?? '',
        code:             editingVoucher.code             ?? '',
        typeDiscount:     editingVoucher.typeDiscount     ?? DiscountType.PERCENTAGE,
        value:            editingVoucher.value            ?? 0,
        usageLimit:       editingVoucher.usageLimit       ?? 100,
        // Convert ISO → YYYY-MM-DD so <input type="date"> renders correctly
        startedDate:      isoToDateInput(editingVoucher.startedDate),
        endedDate:        isoToDateInput(editingVoucher.endedDate),
        minOrderValue:    editingVoucher.minOrderValue    ?? 0,
        maxDiscountValue: editingVoucher.maxDiscountValue ?? 0,
        applyScope:       editingVoucher.applyScope       ?? ApplyScope.ALL,
        status:           editingVoucher.status           ?? Status.DRAFT
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editingVoucher, isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ ...form })
  }

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition bg-white placeholder:text-slate-300'

  const isPerc = form.typeDiscount === DiscountType.PERCENTAGE

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint-400 to-mint-600 flex items-center justify-center text-white shadow-lg shadow-mint-200/50">
              <IoTicketOutline size={18} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-800 leading-tight">
                {editingVoucher ? 'Edit Voucher' : 'New Voucher'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {editingVoucher ? editingVoucher.code : 'Configure campaign details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {/* Identity */}
          <Section title="Identity">
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2">
                <FormRow label="Code *">
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={`${inputCls} font-mono font-bold tracking-wider`}
                    placeholder="SUMMER25"
                  />
                </FormRow>
              </div>
              <div className="col-span-3">
                <FormRow label="Campaign Name *">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Summer Mega Sale 2026"
                  />
                </FormRow>
              </div>
            </div>
            <FormRow label="Description">
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputCls} min-h-[72px] resize-none`}
                placeholder="Internal note about this voucher…"
              />
            </FormRow>
          </Section>

          {/* Discount */}
          <Section title="Discount">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Type">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-[10px] font-black uppercase tracking-tighter">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, typeDiscount: DiscountType.PERCENTAGE })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${isPerc ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    <span className="text-base">%</span> Percent
                  </button>
                   <button
                    type="button"
                    onClick={() => setForm({ ...form, typeDiscount: DiscountType.FIXED })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${!isPerc ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    <IoCashOutline size={14} /> Fixed ₫
                  </button>
                </div>
              </FormRow>
              <FormRow label={isPerc ? 'Value (%)' : 'Value (₫)'}>
                <input
                  type="number"
                  min={0}
                  max={isPerc ? 100 : undefined}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: +e.target.value })}
                  className={`${inputCls} font-black text-mint-600`}
                  placeholder={isPerc ? '25' : '100000'}
                />
              </FormRow>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <FormRow label="Min Order Value (₫)">
                <input
                  type="number"
                  min={0}
                  value={form.minOrderValue}
                  onChange={(e) => setForm({ ...form, minOrderValue: +e.target.value })}
                  className={inputCls}
                  placeholder="0 = no minimum"
                />
              </FormRow>
              {isPerc && (
                <FormRow label="Max Discount Cap (₫)">
                  <input
                    type="number"
                    min={0}
                    value={form.maxDiscountValue}
                    onChange={(e) => setForm({ ...form, maxDiscountValue: +e.target.value })}
                    className={inputCls}
                    placeholder="0 = unlimited"
                  />
                </FormRow>
              )}
            </div>
          </Section>

          {/* Scope & Limits */}
          <Section title="Scope & Limits">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Apply Scope">
                <select
                  value={form.applyScope}
                  onChange={(e) => setForm({ ...form, applyScope: e.target.value as VoucherApplyScope })}
                  className={inputCls}
                >
                  {/* Dynamically driven from ApplyScope enum — add new values to the enum + APPLY_SCOPE_LABELS map only */}
                  {Object.values(ApplyScope).map((scopeVal) => (
                    <option key={scopeVal} value={scopeVal}>
                      {APPLY_SCOPE_LABELS[scopeVal] ?? scopeVal}
                    </option>
                  ))}
                </select>
              </FormRow>
              <FormRow label="Usage Limit">
                <div className="relative">
                  <IoInfiniteOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={17} />
                  <input
                    type="number"
                    min={1}
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </FormRow>
            </div>
          </Section>

          {/* Schedule */}
          <Section title="Schedule">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Active From">
                <div className="relative">
                  <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                  <input
                    type="date"
                    value={form.startedDate}
                    onChange={(e) => setForm({ ...form, startedDate: e.target.value })}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </FormRow>
              <FormRow label="Valid Until">
                <div className="relative">
                  <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                  <input
                    type="date"
                    value={form.endedDate}
                    onChange={(e) => setForm({ ...form, endedDate: e.target.value })}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </FormRow>
            </div>
            {(!form.startedDate || !form.endedDate) && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2.5">
                <IoAlertCircleOutline className="text-amber-500 shrink-0" size={16} />
                <p className="text-[11px] font-bold text-amber-700">Please set both start and end dates.</p>
              </div>
            )}
          </Section>

          {/* Status — driven from Status enum + STATUS_CFG map */}
          <Section title="Status">
            <div className="grid grid-cols-3 gap-2">
              {Object.values(Status).map((s) => {
                const c = STATUS_CFG[s]
                if (!c) return null
                const sel = form.status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, status: s })}
                    className={`py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all ${sel ? c.active : `bg-white ${c.idle} hover:border-slate-300`}`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.code?.trim() || !form.name?.trim() || (form.value ?? 0) <= 0 || isSaving}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-mint-500 to-mint-600 text-white text-sm font-black hover:from-mint-600 hover:to-mint-700 transition shadow-lg shadow-mint-200/50 disabled:opacity-40 disabled:shadow-none flex items-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <IoCheckmarkOutline size={16} />
            )}
            {isSaving ? 'Saving…' : editingVoucher ? 'Save Changes' : 'Create Voucher'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>,
    document.body
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}
