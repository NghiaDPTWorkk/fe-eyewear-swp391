import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  IoTicketOutline,
  IoPricetagOutline,
  IoInfiniteOutline,
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoPersonAddOutline,
  IoSearchOutline
} from 'react-icons/io5'

// ─── Types ────────────────────────────────────────────────────────
export type VoucherDiscountType = 'PERCENTAGE' | 'FIXED'
export type VoucherStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
export type VoucherApplyScope = 'ALL' | 'SPECIFIC'
export type SelectionMode = 'MANUAL' | 'RULE'

export interface Voucher {
  _id: string
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number
  usageLimit: number
  usageCount: number
  startedDate: string
  endedDate: string
  minOrderValue: number
  maxDiscountValue: number
  applyScope: VoucherApplyScope
  status: VoucherStatus
  selectionMode: SelectionMode
  minSpendingRule: number
  minOrderRule: number
  assignedTo: string[]
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  avatarInitials: string
  totalSpending: number
  orderCount: number
}

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
  selectionMode: SelectionMode
  minSpendingRule: number
  minOrderRule: number
  assignedTo: string[]
}

const EMPTY_FORM: FormState = {
  name: '', description: '', code: '',
  typeDiscount: 'PERCENTAGE', value: 0,
  usageLimit: 100, startedDate: '', endedDate: '',
  minOrderValue: 0, maxDiscountValue: 0,
  applyScope: 'ALL', selectionMode: 'RULE',
  minSpendingRule: 0, minOrderRule: 0,
  status: 'ACTIVE', assignedTo: []
}

interface VoucherAdditionProps {
  isOpen: boolean
  onClose: () => void
  onSave: (voucher: Partial<Voucher>) => void
  editingVoucher: Voucher | null
  customers: Customer[]
}

// ─── Component ────────────────────────────────────────────────────
export const VoucherAddition: React.FC<VoucherAdditionProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVoucher,
  customers
}) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [custSearch, setCustSearch] = useState('')

  useEffect(() => {
    if (editingVoucher) {
      setForm({
        _id: editingVoucher._id,
        name: editingVoucher.name,
        description: editingVoucher.description,
        code: editingVoucher.code,
        typeDiscount: editingVoucher.typeDiscount,
        value: editingVoucher.value,
        usageLimit: editingVoucher.usageLimit,
        startedDate: editingVoucher.startedDate || '',
        endedDate: editingVoucher.endedDate || '',
        minOrderValue: editingVoucher.minOrderValue,
        maxDiscountValue: editingVoucher.maxDiscountValue,
        applyScope: editingVoucher.applyScope,
        selectionMode: editingVoucher.selectionMode || 'MANUAL',
        minSpendingRule: editingVoucher.minSpendingRule || 0,
        minOrderRule: editingVoucher.minOrderRule || 0,
        status: editingVoucher.status,
        assignedTo: [...editingVoucher.assignedTo]
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setCustSearch('')
  }, [editingVoucher, isOpen])

  if (!isOpen) return null

  const calculateStatus = (started: string, ended: string, limit: number, count: number): VoucherStatus => {
    const today = new Date().toISOString().split('T')[0]
    if (count >= limit) return 'EXPIRED'
    if (ended && today > ended) return 'EXPIRED'
    if (started && today < started) return 'INACTIVE'
    return 'ACTIVE'
  }

  const handleSave = () => {
    const derivedStatus = calculateStatus(
      form.startedDate,
      form.endedDate,
      form.usageLimit,
      editingVoucher?.usageCount || 0
    )
    onSave({ ...form, status: derivedStatus })
  }

  const toggleFormCustomer = (custId: string) =>
    setForm((f) => ({
      ...f,
      assignedTo: f.assignedTo.includes(custId)
        ? f.assignedTo.filter((id) => id !== custId)
        : [...f.assignedTo, custId]
    }))

  const filteredFormCustomers = customers.filter((c) =>
    !custSearch || c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.email.includes(custSearch)
  )

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition bg-white'

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 bg-white/40 sticky top-0 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-neutral-800 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint-400 to-mint-600 flex items-center justify-center text-white shadow-lg shadow-mint-200/50">
                <IoTicketOutline size={18} />
              </div>
              {editingVoucher ? 'Refine Voucher' : 'Design New Voucher'}
            </h2>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1 ml-10">
              {editingVoucher ? 'Updating existing configuration' : 'Configure your campaign details'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 text-neutral-400 transition-colors">
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 space-y-7 flex-1 custom-scrollbar scroll-smooth">
          {/* Identity & Basic Info */}
          <Section title="Voucher Identity">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-4">
                <FormRow label="Voucher Code *">
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={`${inputCls} font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal`} placeholder="e.g. SUMMER25" />
                </FormRow>
              </div>
              <div className="col-span-8">
                <FormRow label="Campaign Name *">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls} placeholder="e.g. Summer Mega Sale 2026" />
                </FormRow>
              </div>
            </div>
            <FormRow label="Internal Description">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`${inputCls} min-h-[80px] resize-none py-2.5`} placeholder="What is this voucher for? (internal note)" />
            </FormRow>
          </Section>

          {/* Reward Configuration */}
          <Section title="Reward Configuration">
            <div className="grid grid-cols-2 gap-5">
              <FormRow label="Discount Engine">
                <div className="flex p-1 bg-neutral-100 rounded-xl border border-neutral-200/50 text-[10px] font-black uppercase tracking-tighter">
                  <button onClick={() => setForm({ ...form, typeDiscount: 'PERCENTAGE' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${form.typeDiscount === 'PERCENTAGE' ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-neutral-400 hover:text-neutral-500'}`}>
                    <span className="text-sm">%</span> Percent
                  </button>
                  <button onClick={() => setForm({ ...form, typeDiscount: 'FIXED' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${form.typeDiscount === 'FIXED' ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-neutral-400 hover:text-neutral-500'}`}>
                    <IoPricetagOutline size={12} /> Fixed
                  </button>
                </div>
              </FormRow>
              <FormRow label={form.typeDiscount === 'PERCENTAGE' ? 'Discount Value (%)' : 'Discount Value (₫)'}>
                <input type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })}
                  className={`${inputCls} font-bold text-mint-600 focus:ring-mint-400/30`} placeholder="0" />
              </FormRow>
            </div>

            <div className="grid grid-cols-2 gap-5 mt-4">
              <FormRow label="Min Order Value (₫)">
                <input type="number" min={0} value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: +e.target.value })}
                  className={inputCls} placeholder="0" />
              </FormRow>
              {form.typeDiscount === 'PERCENTAGE' && (
                <FormRow label="Max Discount Cap (₫)">
                  <input type="number" min={0} value={form.maxDiscountValue} onChange={(e) => setForm({ ...form, maxDiscountValue: +e.target.value })}
                    className={inputCls} placeholder="Unlimited" />
                </FormRow>
              )}
            </div>
          </Section>

          {/* Limits & Scope */}
          <Section title="Usage & Scope">
            <div className="grid grid-cols-2 gap-5">
              <FormRow label="Total Usage Limit">
                <div className="relative">
                  <IoInfiniteOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                  <input type="number" min={1} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: +e.target.value })}
                    className={`${inputCls} pl-10`} />
                </div>
              </FormRow>
              <FormRow label="Application Scope">
                <select value={form.applyScope} onChange={(e) => setForm({ ...form, applyScope: e.target.value as VoucherApplyScope, assignedTo: [] })} className={inputCls}>
                  <option value="ALL">Public (All Users)</option>
                  <option value="SPECIFIC">Targeted (Restricted)</option>
                </select>
              </FormRow>
            </div>
          </Section>

          {/* Campaign Schedule */}
          <Section title="Campaign Schedule">
            <div className="grid grid-cols-2 gap-5">
              <FormRow label="Active From">
                <div className="relative">
                  <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                  <input type="date" value={form.startedDate} onChange={(e) => setForm({ ...form, startedDate: e.target.value })} className={`${inputCls} pl-10`} />
                </div>
              </FormRow>
              <FormRow label="Valid Until">
                <div className="relative">
                  <IoCalendarOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                  <input type="date" value={form.endedDate} onChange={(e) => setForm({ ...form, endedDate: e.target.value })} className={`${inputCls} pl-10`} />
                </div>
              </FormRow>
            </div>
            {!form.startedDate || !form.endedDate ? (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-100/50 rounded-xl flex items-center gap-3">
                <IoAlertCircleOutline className="text-amber-500" size={18} />
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">Status will be live calculated</p>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-emerald-800">Status: <span className="uppercase">{calculateStatus(form.startedDate, form.endedDate, form.usageLimit, editingVoucher?.usageCount || 0)}</span></p>
              </div>
            )}
          </Section>

          {/* Targeting Analysis (Conditional) */}
          {form.applyScope === 'SPECIFIC' && (
            <Section title="Target Audience"
              badge={form.selectionMode === 'RULE' ? 'Auto Segment' : 'Manual Picker'}
              action={
                <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/50">
                  <button onClick={() => setForm({ ...form, selectionMode: 'RULE' })}
                    className={`px-3 py-1 text-[10px] font-black rounded-md transition ${form.selectionMode === 'RULE' ? 'bg-white text-mint-600 shadow-sm' : 'text-neutral-400'}`}>SEGMENT</button>
                  <button onClick={() => setForm({ ...form, selectionMode: 'MANUAL' })}
                    className={`px-3 py-1 text-[10px] font-black rounded-md transition ${form.selectionMode === 'MANUAL' ? 'bg-white text-mint-600 shadow-sm' : 'text-neutral-400'}`}>SELECT</button>
                </div>
              }
            >
              {form.selectionMode === 'RULE' ? (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-2 gap-4">
                    <FormRow label="Min Spending (₫)">
                      <input type="number" value={form.minSpendingRule} onChange={(e) => setForm({ ...form, minSpendingRule: +e.target.value })}
                        className={inputCls} placeholder="0" />
                    </FormRow>
                    <FormRow label="Min Orders">
                      <input type="number" value={form.minOrderRule} onChange={(e) => setForm({ ...form, minOrderRule: +e.target.value })}
                        className={inputCls} placeholder="0" />
                    </FormRow>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-mint-50 to-white rounded-2xl border border-mint-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-mint-100 flex items-center justify-center text-mint-600 shadow-sm">
                        <IoPersonAddOutline size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-mint-900 tracking-tight">Active Reach</p>
                        <p className="text-[11px] text-mint-600/60 font-bold uppercase">Dynamic matching</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-mint-700 tabular-nums">
                        {customers.filter(c => c.totalSpending >= form.minSpendingRule && c.orderCount >= form.minOrderRule).length}
                      </span>
                      <p className="text-[10px] font-black text-mint-500 uppercase mt-1">Users</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div className="relative group">
                    <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-mint-500 transition-colors" size={16} />
                    <input value={custSearch} onChange={(e) => setCustSearch(e.target.value)}
                      placeholder="Search customers..." className={`${inputCls} pl-10`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {filteredFormCustomers.map((c) => {
                      const isSel = form.assignedTo.includes(c.id)
                      return (
                        <div key={c.id} onClick={() => toggleFormCustomer(c.id)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${isSel ? 'bg-mint-50 border-mint-200 shadow-sm' : 'bg-white border-neutral-50 hover:bg-neutral-50 hover:border-neutral-100'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${isSel ? 'bg-mint-500 text-white shadow-lg' : 'bg-neutral-100 text-neutral-400'}`}>{c.avatarInitials}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-800 truncate leading-tight">{c.name}</p>
                            <p className="text-[10px] text-neutral-400 font-black uppercase mt-0.5">₫{c.totalSpending.toLocaleString()}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSel ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-neutral-200'}`}>
                            {isSel && <IoCheckmarkOutline size={12} className="text-white" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-neutral-200 text-neutral-500 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-neutral-700 transition shadow-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="px-10 py-2.5 rounded-xl bg-gradient-to-r from-mint-500 to-mint-600 text-white text-[11px] font-black uppercase tracking-widest hover:from-mint-600 hover:to-mint-700 transition shadow-xl shadow-mint-200/50 disabled:opacity-40 disabled:shadow-none flex items-center gap-2"
            disabled={!form.code.trim() || !form.name.trim() || form.value <= 0}>
            <IoCheckmarkOutline size={16} />
            {editingVoucher ? 'Push Changes' : 'Blast Launch'}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const modalRoot = document.body
  if (!modalRoot) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>,
    modalRoot
  )
}

function Section({ title, children, action, badge }: {
  title: string; children: React.ReactNode; action?: React.ReactNode; badge?: string
}) {
  return (
    <div className="rounded-xl border border-neutral-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">{title}</span>
          {badge && <span className="px-2 py-0.5 rounded-full bg-mint-100 text-mint-700 text-[10px] font-bold">{badge}</span>}
        </div>
        {action}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}
