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
    <div className="group space-y-1.5 flex flex-col pt-1">
      <div className="flex items-center justify-between px-1">
        <label className="text-[11px] font-bold text-slate-500 group-hover:text-mint-600 transition-colors">
          {label}
        </label>
        {disabled && (
          <span className="text-[8px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">
            Auto
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full bg-white border-2 ${
            error ? 'border-red-500 bg-red-50/10' : 'border-slate-100'
          } rounded-[16px] px-3 h-11 text-sm font-bold focus:outline-none focus:border-mint-500/50 focus:bg-white focus:shadow-[0_4px_12px_-4px_rgba(74,215,176,0.3)] transition-all text-center disabled:opacity-40 disabled:bg-slate-50 shadow-sm`}
          placeholder={placeholder}
        />
        {error && <p className="mt-1 text-[10px] text-red-500 font-bold text-center">{error}</p>}
      </div>
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
  confirmText = 'I confirm that the prescription values entered above are taken from a valid (not expired) prescription issued to me, signed by a licensed optometrist or ophthalmologist.'
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
        errors[fieldName] = `Out of range [${rule.min}, ${rule.max}]`
      } else if (Math.abs((num * 100) % (rule.step * 100)) > 0.01) {
        // Using 100 to avoid floating point issues
        warnings.push(`${fieldName} Multiples of ${rule.step}`)
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
        errors[`${eye}.AXIS`] = 'AXIS required'
      }

      // Step 5: CYL Sign
      if (cyl > 0) {
        warnings.push(`(+) CYL for ${eyeLabel}`)
      }

      // Step 6: High Index Warning
      const sph = Math.abs(parseFloat(formData[eye].SPH))
      const absCyl = Math.abs(cyl)
      if (sph > 10 || absCyl > 4) {
        warnings.push(`${eyeLabel} high. Consider 1.74 lenses.`)
      }
    })

    // PD Validation
    if (formData.PD) {
      const pd = parseFloat(formData.PD)
      if (pd < VALIDATION_RULES.PD.min || pd > VALIDATION_RULES.PD.max) {
        errors.PD = `PD [${VALIDATION_RULES.PD.min}-${VALIDATION_RULES.PD.max}]`
      }
    }

    // Step 4: ADD Equality
    const addLeft = formData.left.ADD
    const addRight = formData.right.ADD
    if (addLeft && addRight && addLeft !== addRight) {
      warnings.push('Verify ADD equality')
    }

    // Step 7: SPH and ADD Logic
    const sphRight = parseFloat(formData.right.SPH)
    const addRightNum = parseFloat(formData.right.ADD)
    if (sphRight > 5 && addRightNum === 0) {
      warnings.push('Check SPH & ADD match')
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
    toast.success('Synced to Left', {
      style: {
        background: '#f6fffb',
        color: '#1a6d53',
        border: '1px solid #7fe3c7',
        fontSize: '11px',
        fontWeight: 'bold'
      }
    })
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
      toast.error('Incomplete details.')
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      {/* Legend Chips - Compact */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'sph', title: 'SPH', color: 'bg-indigo-50 text-indigo-600' },
          { id: 'ast', title: 'CYL/AXIS', color: 'bg-pink-50 text-pink-600' },
          { id: 'add', title: 'ADD', color: 'bg-amber-50 text-amber-600' },
          { id: 'pd', title: 'PD', color: 'bg-emerald-50 text-emerald-600' }
        ].map((item) => (
          <div
            key={item.id}
            className={`px-4 py-2 rounded-xl border-2 ${item.color} shrink-0 border-current/10`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Note Section - MOVED TO TOP */}
      {validationResults.warnings.length > 0 && (
        <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-200/50">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Note</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {validationResults.warnings.map((warning, index) => (
              <li
                key={index}
                className="text-[10px] text-slate-600 font-bold flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Right Eye - TOP */}
        <div className="p-6 bg-white rounded-[28px] border-2 border-slate-100 shadow-sm flex flex-col group/right hover:border-mint-200 transition-colors">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-mint-500 shadow-[0_0_8px_rgba(74,215,176,1)]" />
              <h4 className="text-sm font-bold text-slate-800">Right Eye (OD)</h4>
            </div>
            <span className="px-2 py-0.5 bg-mint-50 text-mint-500 text-[9px] font-black rounded-md border border-mint-100 uppercase">
              Right
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
              label="AXIS (Degrees)"
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

          <div className="mt-8 flex justify-center -mb-10 relative z-10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyRightToLeft}
              className="h-10 px-6 text-[10px] font-bold text-slate-500 hover:text-white hover:bg-mint-600 gap-2 rounded-full transition-all bg-white shadow-md border-2 border-slate-100 hover:border-transparent group/sync"
            >
              <Copy size={12} className="group-hover/sync:rotate-12 transition-transform" />
              Copy Right values down to Left Eye
            </Button>
          </div>
        </div>

        {/* Left Eye - BOTTOM */}
        <div className="p-6 bg-slate-50/10 rounded-[28px] border-2 border-slate-100/50 flex flex-col pt-10">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100/50">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <h4 className="text-sm font-bold text-slate-800">Left Eye (OS)</h4>
            </div>
            <span className="px-2 py-0.5 bg-white border border-slate-100 text-slate-400 text-[9px] font-black rounded-md uppercase">
              Left
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
              label="AXIS (Degrees)"
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

      {/* PD Section - Vertical Stacked for breathing room */}
      <div className="pt-6 border-t border-slate-100 flex flex-col gap-6">
        <div className="w-full lg:max-w-sm">
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

        <div className="bg-mint-50/[0.15] rounded-2xl p-5 border border-mint-500/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-mint-100/50 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-mint-600" />
          </div>
          <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
            PD is the distance between your pupils. Standard measurements are typically between
            55-75mm.
          </p>
        </div>
      </div>

      {/* PD Unusual Range Confirmation */}
      {((parseFloat(formData.PD) > 0 && parseFloat(formData.PD) < 55) ||
        parseFloat(formData.PD) > 75) && (
        <div
          className="p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-center gap-4 cursor-pointer hover:bg-red-50 transition-colors"
          onClick={() => setPdConfirmed(!pdConfirmed)}
        >
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <Checkbox
            isChecked={pdConfirmed}
            onCheckedChange={setPdConfirmed}
            label="I confirm this PD is correct (typical 55-75mm)"
            labelClassName="text-[10px] text-red-800 font-bold uppercase tracking-tight cursor-pointer"
            size="sm"
          />
        </div>
      )}

      {/* Footer Actions */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          {showDefaultCheckbox && (
            <div
              className="flex items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setFormData((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
            >
              <Checkbox
                id="isDefault"
                isChecked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isDefault: checked }))
                }
                label="Set as default prescription"
                labelClassName="text-[11px] text-slate-600 font-bold cursor-pointer"
                size="sm"
              />
            </div>
          )}

          {showConfirmCheckbox && (
            <div
              className="flex items-start bg-mint-50/30 p-5 rounded-xl border border-mint-100/50 hover:bg-mint-50/50 transition-colors gap-4 cursor-pointer"
              onClick={() => setIsConfirmed(!isConfirmed)}
            >
              <div className="pt-0.5 pointer-events-none">
                <Checkbox isChecked={isConfirmed} onCheckedChange={setIsConfirmed} size="sm" />
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed pointer-events-none">
                {confirmText}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || (showConfirmCheckbox && !isConfirmed) || !isFormValid()}
            className="flex-[2] h-14 rounded-xl font-bold text-sm bg-mint-600 text-white hover:bg-mint-700 shadow-lg shadow-mint-100 transition-all active:scale-[0.98]"
          >
            {isLoading ? 'Processing...' : submitLabel || (initialData ? 'Update' : 'Add to Cart')}
          </Button>
        </div>
      </div>
    </form>
  )
}
