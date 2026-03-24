import { useState, useEffect, useMemo } from 'react'
import type { Prescription } from '@/shared/types/prescription.types'
import { Button } from '@/shared/components/ui/button'
import { Copy, AlertCircle, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Checkbox } from '@/shared/components/ui/checkbox/Checkbox'

const VALIDATION_RULES = {
  SPH: { min: -20.0, max: 20.0, step: 0.25 },
  CYL: { min: -20.0, max: 20.0, step: 0.25 },
  AXIS: { min: 0, max: 180, step: 1 },
  ADD: { min: 0.75, max: 3.5, step: 0.25 },
  PD: { min: 35, max: 65, step: 0.5 }
}

interface PrescriptionInputProps {
  label: string
  value: string
  onChange: (val: string) => void
  step: number
  min: number
  max: number
  placeholder?: string
  disabled?: boolean
  error?: string
}

const PrescriptionInput = ({
  label,
  value,
  onChange,
  step,
  min,
  max,
  placeholder,
  disabled,
  error
}: PrescriptionInputProps) => {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
        {label}
      </label>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-white border ${
          error ? 'border-red-500' : 'border-slate-200'
        } rounded-2xl px-4 h-11 text-sm font-semibold focus:outline-none focus:border-mint-500 focus:ring-1 focus:ring-mint-500 transition-all text-center disabled:bg-gray-50 disabled:text-gray-400 shadow-sm`}
        placeholder={placeholder}
      />
      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}
    </div>
  )
}

interface PrescriptionFormState {
  left: { SPH: string; CYL: string; AXIS: string; ADD: string }
  right: { SPH: string; CYL: string; AXIS: string; ADD: string }
  PD: string
  isDefault: boolean
}

interface PrescriptionFormProps {
  initialData?: Prescription
  onSubmit: (data: Prescription) => void
  onCancel?: () => void
  isLoading?: boolean
  showDefaultCheckbox?: boolean
  submitLabel?: string
  cancelLabel?: string
  showConfirmCheckbox?: boolean
  confirmText?: string
}

export function PrescriptionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  showDefaultCheckbox = true,
  submitLabel,
  cancelLabel = 'Cancel',
  showConfirmCheckbox = false,
  confirmText = 'I confirm that the prescription values entered above are valid.'
}: PrescriptionFormProps) {
  // Internal state using string for inputs to allow empty values
  const [formData, setFormData] = useState<PrescriptionFormState>(() => {
    if (initialData) {
      return {
        left: {
          SPH: initialData.left.SPH?.toString() || '',
          CYL: initialData.left.CYL?.toString() || '',
          AXIS: initialData.left.AXIS?.toString() || '',
          ADD: initialData.left.ADD?.toString() || ''
        },
        right: {
          SPH: initialData.right.SPH?.toString() || '',
          CYL: initialData.right.CYL?.toString() || '',
          AXIS: initialData.right.AXIS?.toString() || '',
          ADD: initialData.right.ADD?.toString() || ''
        },
        PD: initialData.PD?.toString() || '',
        isDefault: initialData.isDefault || false
      }
    }
    return {
      left: { SPH: '', CYL: '', AXIS: '', ADD: '' },
      right: { SPH: '', CYL: '', AXIS: '', ADD: '' },
      PD: '',
      isDefault: false
    }
  })
  const [isConfirmed, setIsConfirmed] = useState(!showConfirmCheckbox)
  const [pdConfirmed, setPdConfirmed] = useState(false)

  const validationResults = useMemo(() => {
    const warnings: string[] = []
    const errors: Record<string, string> = {}

    const checkRange = (
      val: string,
      rule: { min: number; max: number; step: number },
      fieldName: string
    ) => {
      if (!val) return
      const num = parseFloat(val)
      if (num < rule.min || num > rule.max) {
        errors[fieldName] = `Value must be between ${rule.min} and ${rule.max}`
      } else if (Math.abs((num * 100) % (rule.step * 100)) > 0.01) {
        // Using 100 to avoid floating point issues
        warnings.push(`${fieldName} is usually a multiple of ${rule.step}`)
      }
    }

    // Individual field checks
    ;(['left', 'right'] as const).forEach((eye) => {
      const eyeLabel = eye === 'left' ? 'Left Eye' : 'Right Eye'
      checkRange(formData[eye].SPH, VALIDATION_RULES.SPH, `${eye}.SPH`)
      checkRange(formData[eye].CYL, VALIDATION_RULES.CYL, `${eye}.CYL`)
      checkRange(formData[eye].AXIS, VALIDATION_RULES.AXIS, `${eye}.AXIS`)
      checkRange(formData[eye].ADD, VALIDATION_RULES.ADD, `${eye}.ADD`)

      // Step 3: CYL & AXIS dependency
      const cyl = parseFloat(formData[eye].CYL)
      if (cyl !== 0 && !formData[eye].AXIS) {
        errors[`${eye}.AXIS`] = 'AXIS is required when CYL is entered'
      }

      // Step 5: CYL Sign
      if (cyl > 0) {
        warnings.push(
          `Detected positive (+) CYL for ${eyeLabel}. Usually CYL is converted to negative (-).`
        )
      }

      // Step 6: High Index Warning
      const sph = Math.abs(parseFloat(formData[eye].SPH))
      const absCyl = Math.abs(cyl)
      if (sph > 10 || absCyl > 4) {
        warnings.push(
          `${eyeLabel} prescription is quite high. Consider high-index lenses (1.74) for better comfort.`
        )
      }
    })

    // PD Validation
    if (formData.PD) {
      const pd = parseFloat(formData.PD)
      if (pd < VALIDATION_RULES.PD.min || pd > VALIDATION_RULES.PD.max) {
        errors.PD = `PD must be between ${VALIDATION_RULES.PD.min} - ${VALIDATION_RULES.PD.max}`
      }
    }

    // Step 4: ADD Equality
    const addLeft = formData.left.ADD
    const addRight = formData.right.ADD
    if (addLeft && addRight && addLeft !== addRight) {
      warnings.push(
        'Typically, ADD values for both eyes are identical. Please verify your prescription.'
      )
    }

    // Step 7: SPH and ADD Logic
    const sphRight = parseFloat(formData.right.SPH)
    const addRightNum = parseFloat(formData.right.ADD)
    if (sphRight > 5 && addRightNum === 0) {
      warnings.push(
        'High positive SPH with ADD = 0 may be a mistake. Please check the rows on your prescription.'
      )
    }

    return { errors, warnings }
  }, [formData])

  const isFormValid = () => {
    // SPH and PD are always required
    const mandatoryFields = [
      { name: 'right.SPH', value: formData.right.SPH },
      { name: 'left.SPH', value: formData.left.SPH },
      { name: 'PD', value: formData.PD }
    ]

    const allMandatoryFilled = mandatoryFields.every((f) => f.value !== '')

    // AXIS is required ONLY if CYL is entered and is not 0
    const rightCylNum = parseFloat(formData.right.CYL) || 0
    const leftCylNum = parseFloat(formData.left.CYL) || 0

    const rightAxisRequired = rightCylNum !== 0
    const leftAxisRequired = leftCylNum !== 0

    const rightAxisOk = rightAxisRequired ? formData.right.AXIS !== '' : true
    const leftAxisOk = leftAxisRequired ? formData.left.AXIS !== '' : true

    const hasErrors = Object.keys(validationResults.errors).length > 0
    const pdNum = parseFloat(formData.PD)
    const pdRequirementMet =
      (pdNum >= 55 && pdNum < 75) || (pdNum >= 35 && pdNum <= 80 && pdConfirmed)

    return allMandatoryFilled && rightAxisOk && leftAxisOk && !hasErrors && pdRequirementMet
  }

  const handleCopyRightToLeft = () => {
    setFormData((prev) => ({
      ...prev,
      left: { ...prev.right }
    }))
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        left: {
          SPH: initialData.left.SPH.toString(),
          CYL: initialData.left.CYL.toString(),
          AXIS: initialData.left.AXIS.toString(),
          ADD: initialData.left.ADD.toString()
        },
        right: {
          SPH: initialData.right.SPH.toString(),
          CYL: initialData.right.CYL.toString(),
          AXIS: initialData.right.AXIS.toString(),
          ADD: initialData.right.ADD.toString()
        },
        PD: initialData.PD.toString(),
        isDefault: initialData.isDefault || false
      })
    }
  }, [initialData])

  const handleEyeChange = (
    eye: 'left' | 'right',
    field: keyof PrescriptionFormState['left'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
    }))
  }

  const handlePDChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      PD: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showConfirmCheckbox && !isConfirmed) return
    if (!isFormValid()) {
      toast.error('Please fix validation errors before submitting.')
      return
    }

    // Convert string values to numbers before submitting, default to 0 if empty
    const rightCyl = parseFloat(formData.right.CYL) || 0
    const leftCyl = parseFloat(formData.left.CYL) || 0

    const submissionData: Prescription = {
      ...formData,
      right: {
        SPH: parseFloat(formData.right.SPH) || 0,
        CYL: rightCyl,
        AXIS: rightCyl === 0 ? 0 : parseFloat(formData.right.AXIS) || 0,
        ADD: parseFloat(formData.right.ADD) || 0
      },
      left: {
        SPH: parseFloat(formData.left.SPH) || 0,
        CYL: leftCyl,
        AXIS: leftCyl === 0 ? 0 : parseFloat(formData.left.AXIS) || 0,
        ADD: parseFloat(formData.left.ADD) || 0
      },
      PD: parseFloat(formData.PD) || 0
    }

    onSubmit(submissionData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {/* Business Rules Header - Matching Staff UI */}
      <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h5 className="text-[11px] font-black text-amber-800 uppercase tracking-[0.2em] mb-3">
            Business Rules: Valid Ranges
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            <div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                SPH
              </p>
              <p className="text-xs font-bold text-amber-900">-20.00 — +20.00</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                CYL
              </p>
              <p className="text-xs font-bold text-amber-900">-20.00 — +20.00</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                AXIS
              </p>
              <p className="text-xs font-bold text-amber-900">0 — 180</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                ADD
              </p>
              <p className="text-xs font-bold text-amber-900">0.75 — 3.50</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-amber-600/60 uppercase tracking-widest mb-1">
                PD
              </p>
              <p className="text-xs font-bold text-amber-900">35 — 65</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Right Eye (OD) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
            <div className="w-2.5 h-2.5 rounded-full bg-mint-500 shadow-[0_0_10px_rgba(74,215,176,0.4)]" />
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
              Right Eye (OD)
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <PrescriptionInput
              label="SPH (Sphere)"
              value={formData.right.SPH}
              onChange={(val) => handleEyeChange('right', 'SPH', val)}
              step={VALIDATION_RULES.SPH.step}
              min={VALIDATION_RULES.SPH.min}
              max={VALIDATION_RULES.SPH.max}
              placeholder="0.00"
              error={validationResults.errors['right.SPH']}
            />
            <PrescriptionInput
              label="CYL (Cylinder)"
              value={formData.right.CYL}
              onChange={(val) => handleEyeChange('right', 'CYL', val)}
              step={VALIDATION_RULES.CYL.step}
              min={VALIDATION_RULES.CYL.min}
              max={VALIDATION_RULES.CYL.max}
              placeholder="0.00"
              error={validationResults.errors['right.CYL']}
            />
            <PrescriptionInput
              label="AXIS (degrees)"
              value={formData.right.AXIS}
              onChange={(val) => handleEyeChange('right', 'AXIS', val)}
              step={VALIDATION_RULES.AXIS.step}
              min={VALIDATION_RULES.AXIS.min}
              max={VALIDATION_RULES.AXIS.max}
              placeholder={parseFloat(formData.right.CYL) === 0 ? '—' : '0'}
              disabled={parseFloat(formData.right.CYL) === 0}
              error={validationResults.errors['right.AXIS']}
            />
            <PrescriptionInput
              label="ADD (Addition)"
              value={formData.right.ADD}
              onChange={(val) => handleEyeChange('right', 'ADD', val)}
              step={VALIDATION_RULES.ADD.step}
              min={VALIDATION_RULES.ADD.min}
              max={VALIDATION_RULES.ADD.max}
              placeholder="0.00"
              error={validationResults.errors['right.ADD']}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyRightToLeft}
            className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-mint-600 hover:bg-mint-50/50 gap-2 rounded-xl transition-all"
          >
            <Copy size={12} />
            Same for left eye
          </Button>
        </div>

        {/* Left Eye (OS) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
              Left Eye (OS)
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <PrescriptionInput
              label="SPH (Sphere)"
              value={formData.left.SPH}
              onChange={(val) => handleEyeChange('left', 'SPH', val)}
              step={VALIDATION_RULES.SPH.step}
              min={VALIDATION_RULES.SPH.min}
              max={VALIDATION_RULES.SPH.max}
              placeholder="0.00"
              error={validationResults.errors['left.SPH']}
            />
            <PrescriptionInput
              label="CYL (Cylinder)"
              value={formData.left.CYL}
              onChange={(val) => handleEyeChange('left', 'CYL', val)}
              step={VALIDATION_RULES.CYL.step}
              min={VALIDATION_RULES.CYL.min}
              max={VALIDATION_RULES.CYL.max}
              placeholder="0.00"
              error={validationResults.errors['left.CYL']}
            />
            <PrescriptionInput
              label="AXIS (degrees)"
              value={formData.left.AXIS}
              onChange={(val) => handleEyeChange('left', 'AXIS', val)}
              step={VALIDATION_RULES.AXIS.step}
              min={VALIDATION_RULES.AXIS.min}
              max={VALIDATION_RULES.AXIS.max}
              placeholder={parseFloat(formData.left.CYL) === 0 ? '—' : '0'}
              disabled={parseFloat(formData.left.CYL) === 0}
              error={validationResults.errors['left.AXIS']}
            />
            <PrescriptionInput
              label="ADD (Addition)"
              value={formData.left.ADD}
              onChange={(val) => handleEyeChange('left', 'ADD', val)}
              step={VALIDATION_RULES.ADD.step}
              min={VALIDATION_RULES.ADD.min}
              max={VALIDATION_RULES.ADD.max}
              placeholder="0.00"
              error={validationResults.errors['left.ADD']}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50">
        <div className="max-w-xs">
          <PrescriptionInput
            label="Pupillary Distance (PD)"
            value={formData.PD}
            onChange={handlePDChange}
            step={VALIDATION_RULES.PD.step}
            min={VALIDATION_RULES.PD.min}
            max={VALIDATION_RULES.PD.max}
            placeholder="e.g. 63"
            error={validationResults.errors.PD}
          />
        </div>

        {((parseFloat(formData.PD) > 0 && parseFloat(formData.PD) < 55) ||
          parseFloat(formData.PD) > 75) && (
          <div className="mt-4 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200/50 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-yellow-100">
                <Info className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[11px] font-black text-yellow-800 uppercase tracking-widest mb-1">
                    PD Note
                  </p>
                  <p className="text-xs text-yellow-700/80 leading-relaxed font-medium">
                    Your PD measurement seems to be outside the normal range (55-75mm). Please
                    verify if this is correct or intended for children.
                  </p>
                </div>
                <Checkbox
                  isChecked={pdConfirmed}
                  onCheckedChange={setPdConfirmed}
                  variant="yellow"
                  label="I confirm this measurement is accurate"
                  labelClassName="text-yellow-800 font-bold"
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {validationResults.warnings.length > 0 && (
        <div className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100/50 space-y-3">
          <div className="flex items-center gap-2 text-orange-700">
            <AlertCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Prescription Warnings
            </span>
          </div>
          <ul className="space-y-1.5">
            {validationResults.warnings.map((warning, index) => (
              <li
                key={index}
                className="text-[11px] text-orange-600/80 font-semibold flex items-start gap-2"
              >
                <span className="mt-1.5 w-1 h-1 bg-orange-400 rounded-full shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDefaultCheckbox && (
        <div className="py-2">
          <Checkbox
            id="isDefault"
            isChecked={formData.isDefault}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked }))}
            label="Set as default prescription"
            labelClassName="text-slate-600 font-bold"
          />
        </div>
      )}

      {showConfirmCheckbox && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <Checkbox
            isChecked={isConfirmed}
            onCheckedChange={setIsConfirmed}
            label={confirmText}
            labelClassName="text-[11px] text-slate-500 font-semibold leading-relaxed"
          />
        </div>
      )}

      <div className="flex gap-4 pt-6">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-2xl py-7 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 border-slate-200"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || (showConfirmCheckbox && !isConfirmed) || !isFormValid()}
          className={`flex-1 rounded-2xl py-7 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 ${
            !isFormValid()
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
              : 'bg-mint-600 text-white hover:bg-mint-700 shadow-xl shadow-mint-100 hover:-translate-y-0.5'
          }`}
        >
          {isLoading
            ? 'Processing...'
            : submitLabel || (initialData ? 'Update Prescription' : 'Save Prescription')}
        </Button>
      </div>
    </form>
  )
}
