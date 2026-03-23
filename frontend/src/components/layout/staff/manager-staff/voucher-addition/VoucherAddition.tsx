import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  IoTicketOutline,
  IoInfiniteOutline,
  /* IoAlertCircleOutline, */
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

const APPLY_SCOPE_LABELS: Record<string, string> = {
  [ApplyScope.ALL]: 'Public — All Users',
  [ApplyScope.SPECIFIC]: 'Targeted — Specific Users'
}

const STATUS_CFG: Record<string, { label: string; active: string; idle: string }> = {
  [Status.DRAFT]: {
    label: 'Draft',
    active: 'bg-amber-50 border-amber-400 text-amber-700',
    idle: 'border-slate-200 text-slate-400'
  },
  [Status.ACTIVE]: {
    label: 'Active',
    active: 'bg-emerald-50 border-emerald-400 text-emerald-700',
    idle: 'border-slate-200 text-slate-400'
  },
  [Status.DISABLE]: {
    label: 'Disabled',
    active: 'bg-slate-100 border-slate-400 text-slate-600',
    idle: 'border-slate-200 text-slate-400'
  }
}

interface FormState {
  _id?: string
  name: string
  description: string
  code: string
  typeDiscount: VoucherDiscountType
  value: number | string
  usageLimit: number | string
  startedDate: string
  endedDate: string
  minOrderValue: number | string
  maxDiscountValue: number | string
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

  isSaving?: boolean
}

export const VoucherAddition: React.FC<VoucherAdditionProps> = ({
  isOpen,
  onClose,
  onSave,
  editingVoucher,
  isSaving = false
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Campaign name is required'),
    code: Yup.string().required('Voucher code is required'),
    typeDiscount: Yup.string().required(),
    value: Yup.number()
      .required('Required')
      .min(0.01, 'Value must be greater than 0')
      .when('typeDiscount', {
        is: DiscountType.PERCENTAGE,
        then: (schema) => schema.max(100, 'Percentage cannot exceed 100%'),
        otherwise: (schema) =>
          schema.test(
            'fixed-value-less-than-min',
            'Discount value must be less than or equal to min order value',
            function (val) {
              const { minOrderValue } = this.parent
              return (val || 0) <= (minOrderValue || 0)
            }
          )
      }),
    usageLimit: Yup.number().required('Required').min(1, 'Limit must be at least 1'),
    startedDate: Yup.date().required('Start date is required'),
    endedDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startedDate'), 'End date cannot be before start date'),
    minOrderValue: Yup.number()
      .min(0, 'Min order value cannot be negative')
      .test('min-less-than-max', 'Min order value must be less than max discount cap', function (value) {
        const { maxDiscountValue, typeDiscount } = this.parent
        if (typeDiscount === DiscountType.PERCENTAGE && maxDiscountValue > 0) {
          return (value || 0) < maxDiscountValue
        }
        return true
      }),
    maxDiscountValue: Yup.number().min(0, 'Max discount cap cannot be negative'),
    applyScope: Yup.string().required(),
    status: Yup.string().required()
  })

  const formik = useFormik<FormState>({
    initialValues: EMPTY_FORM,
    validationSchema,
    onSubmit: (values) => {
      const finalForm = {
        ...values,
        value: Number(values.value) || 0,
        usageLimit: Number(values.usageLimit) || 0,
        minOrderValue: Number(values.minOrderValue) || 0,
        maxDiscountValue: Number(values.maxDiscountValue) || 0
      }
      onSave(finalForm)
    }
  })

  useEffect(() => {
    if (editingVoucher && isOpen) {
      formik.setValues({
        _id: editingVoucher._id,
        name: editingVoucher.name ?? '',
        description: editingVoucher.description ?? '',
        code: editingVoucher.code ?? '',
        typeDiscount: editingVoucher.typeDiscount ?? DiscountType.PERCENTAGE,
        value: editingVoucher.value ?? 0,
        usageLimit: editingVoucher.usageLimit ?? 100,
        startedDate: isoToDateInput(editingVoucher.startedDate),
        endedDate: isoToDateInput(editingVoucher.endedDate),
        minOrderValue: editingVoucher.minOrderValue ?? 0,
        maxDiscountValue: editingVoucher.maxDiscountValue ?? 0,
        applyScope: editingVoucher.applyScope ?? ApplyScope.ALL,
        status: editingVoucher.status ?? Status.DRAFT
      })
    } else if (isOpen) {
      formik.resetForm()
    }
  }, [editingVoucher, isOpen])

  if (!isOpen) return null

  const isPerc = formik.values.typeDiscount === DiscountType.PERCENTAGE
  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-mint-300/50 focus:border-mint-400 transition bg-white placeholder:text-slate-300'

  const blockNonDigits = (e: React.KeyboardEvent) => {
    const isControlKey = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Enter',
      'Escape'
    ].includes(e.key)
    const isDigit = /[0-9]/.test(e.key)

    if (!isDigit && !isControlKey) {
      e.preventDefault()
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {}
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

        {}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {}
          <Section title="Identity">
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2">
                <FormRow label="Code *">
                  <input
                    name="code"
                    value={formik.values.code}
                    onChange={(e) => formik.setFieldValue('code', e.target.value.toUpperCase())}
                    onBlur={formik.handleBlur}
                    className={`${inputCls} font-mono font-bold tracking-wider ${formik.touched.code && formik.errors.code ? 'border-red-500' : ''}`}
                    placeholder="SUMMER25"
                  />
                  {formik.touched.code && formik.errors.code && (
                    <p className="text-[10px] text-red-500 font-bold">{formik.errors.code}</p>
                  )}
                </FormRow>
              </div>
              <div className="col-span-3">
                <FormRow label="Campaign Name *">
                  <input
                    {...formik.getFieldProps('name')}
                    className={`${inputCls} ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g. Summer Mega Sale 2026"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-[10px] text-red-500 font-bold">{formik.errors.name}</p>
                  )}
                </FormRow>
              </div>
            </div>
            <FormRow label="Description">
              <textarea
                {...formik.getFieldProps('description')}
                className={`${inputCls} min-h-[72px] resize-none`}
                placeholder="Internal note about this voucher…"
              />
            </FormRow>
          </Section>

          {}
          <Section title="Discount">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Type">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-[10px] font-black uppercase tracking-tighter">
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('typeDiscount', DiscountType.PERCENTAGE)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${isPerc ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    <span className="text-base">%</span> Percent
                  </button>
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue('typeDiscount', DiscountType.FIXED)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${!isPerc ? 'bg-white text-mint-600 shadow-sm border border-mint-100' : 'text-slate-400 hover:text-slate-500'}`}
                  >
                    <IoCashOutline size={14} /> Fixed ₫
                  </button>
                </div>
              </FormRow>
              <FormRow label={isPerc ? 'Value (%)' : 'Value (₫)'}>
                <input
                  {...formik.getFieldProps('value')}
                  type="text"
                  onKeyDown={blockNonDigits}
                  className={`${inputCls} font-black text-mint-600 ${formik.touched.value && formik.errors.value ? 'border-red-500' : ''}`}
                  placeholder={isPerc ? '25' : '100000'}
                />
                {formik.touched.value && formik.errors.value && (
                  <p className="text-[10px] text-red-500 font-bold">{formik.errors.value}</p>
                )}
              </FormRow>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-1">
              <FormRow label="Min Order Value (₫)">
                <input
                  {...formik.getFieldProps('minOrderValue')}
                  type="text"
                  onKeyDown={blockNonDigits}
                  className={`${inputCls} ${formik.touched.minOrderValue && formik.errors.minOrderValue ? 'border-red-500' : ''}`}
                  placeholder="0 = no minimum"
                />
                {formik.touched.minOrderValue && formik.errors.minOrderValue && (
                  <p className="text-[10px] text-red-500 font-bold">{formik.errors.minOrderValue}</p>
                )}
              </FormRow>
              {isPerc && (
                <FormRow label="Max Discount Cap (₫)">
                  <input
                    {...formik.getFieldProps('maxDiscountValue')}
                    type="text"
                    onKeyDown={blockNonDigits}
                    className={`${inputCls} ${formik.touched.maxDiscountValue && formik.errors.maxDiscountValue ? 'border-red-500' : ''}`}
                    placeholder="0 = unlimited"
                  />
                  {formik.touched.maxDiscountValue && formik.errors.maxDiscountValue && (
                    <p className="text-[10px] text-red-500 font-bold">{formik.errors.maxDiscountValue}</p>
                  )}
                </FormRow>
              )}
            </div>
          </Section>

          {}
          <Section title="Scope & Limits">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Apply Scope">
                <select
                  {...formik.getFieldProps('applyScope')}
                  className={inputCls}
                >
                  {Object.values(ApplyScope).map((scopeVal) => (
                    <option key={scopeVal} value={scopeVal}>
                      {APPLY_SCOPE_LABELS[scopeVal] ?? scopeVal}
                    </option>
                  ))}
                </select>
              </FormRow>
              <FormRow label="Usage Limit">
                <div className="relative">
                  <IoInfiniteOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />
                  <input
                    {...formik.getFieldProps('usageLimit')}
                    type="text"
                    onKeyDown={blockNonDigits}
                    className={`${inputCls} pl-9 ${formik.touched.usageLimit && formik.errors.usageLimit ? 'border-red-500' : ''}`}
                  />
                </div>
                {formik.touched.usageLimit && formik.errors.usageLimit && (
                  <p className="text-[10px] text-red-500 font-bold">{formik.errors.usageLimit}</p>
                )}
              </FormRow>
            </div>
          </Section>

          {}
          <Section title="Schedule">
            <div className="grid grid-cols-2 gap-3">
              <FormRow label="Active From">
                <div className="relative">
                  <IoCalendarOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    size={15}
                  />
                  <input
                    type="date"
                    {...formik.getFieldProps('startedDate')}
                    className={`${inputCls} pl-9 ${formik.touched.startedDate && formik.errors.startedDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {formik.touched.startedDate && formik.errors.startedDate && (
                  <p className="text-[10px] text-red-500 font-bold">{formik.errors.startedDate as string}</p>
                )}
              </FormRow>
              <FormRow label="Valid Until">
                <div className="relative">
                  <IoCalendarOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                    size={15}
                  />
                  <input
                    type="date"
                    {...formik.getFieldProps('endedDate')}
                    className={`${inputCls} pl-9 ${formik.touched.endedDate && formik.errors.endedDate ? 'border-red-500' : ''}`}
                  />
                </div>
                {formik.touched.endedDate && formik.errors.endedDate && (
                  <p className="text-[10px] text-red-500 font-bold">{formik.errors.endedDate as string}</p>
                )}
              </FormRow>
            </div>
          </Section>

          {}
          <Section title="Status">
            <div className="grid grid-cols-3 gap-2">
              {Object.values(Status).map((s) => {
                const c = STATUS_CFG[s]
                if (!c) return null
                const sel = formik.values.status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => formik.setFieldValue('status', s)}
                    className={`py-2.5 rounded-xl border-2 text-xs font-black uppercase tracking-wider transition-all ${sel ? c.active : `bg-white ${c.idle} hover:border-slate-300`}`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </Section>
        </div>

        {}
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
            onClick={() => formik.handleSubmit()}
            disabled={!formik.isValid || !formik.dirty || isSaving}
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
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}
