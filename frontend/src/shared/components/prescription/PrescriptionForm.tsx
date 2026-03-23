import { useState, useEffect, useMemo } from 'react'
import type { Prescription } from '@/shared/types/prescription.types'
import { Button } from '@/shared/components/ui/button'
import { Copy, AlertCircle, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Checkbox } from '@/shared/components/ui/checkbox/Checkbox'

const VALIDATION_RULES = {
  SPH: { min: -20.0, max: 20.0, step: 0.25 },
  CYL: { min: -6.0, max: 0.0, step: 0.25 },
  AXIS: { min: 1, max: 180, step: 1 },
  ADD: { min: 0.75, max: 3.5, step: 0.25 },
  PD: { min: 35, max: 80, step: 0.5 }
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
          error ? 'border-red-500' : 'border-gray-100 shadow-sm'
        } rounded-xl px-4 h-11 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center disabled:bg-gray-50 disabled:text-gray-400`}
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Eye */}
        <div className="space-y-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100 relative">
          <div className="flex justify-between items-center min-h-[2rem] flex-wrap gap-2 mb-2">
            <h4 className="font-bold text-mint-1200 flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></span>
              Right Eye (OD)
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PrescriptionInput
              label="SPH (Sphere)"
              value={formData.right.SPH}
              onChange={(val) => handleEyeChange('right', 'SPH', val)}
              step={VALIDATION_RULES.SPH.step}
              min={VALIDATION_RULES.SPH.min}
              max={VALIDATION_RULES.SPH.max}
              placeholder="0"
              error={validationResults.errors['right.SPH']}
            />
            <PrescriptionInput
              label="CYL (Cylinder)"
              value={formData.right.CYL}
              onChange={(val) => handleEyeChange('right', 'CYL', val)}
              step={VALIDATION_RULES.CYL.step}
              min={VALIDATION_RULES.CYL.min}
              max={VALIDATION_RULES.CYL.max}
              placeholder="0"
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
              placeholder="0"
              error={validationResults.errors['right.ADD']}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyRightToLeft}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-tight text-primary-600 hover:text-primary-700 hover:bg-primary-100/50 gap-1.5 rounded-lg"
            title="Copy Right Eye to Left Eye"
          >
            <Copy className="w-3 h-3 shrink-0" />
            Same for both eyes
          </Button>
        </div>

        {/* Left Eye */}
        <div className="space-y-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
          <div className="flex justify-between items-center min-h-[2rem] flex-wrap gap-2 mb-2">
            <h4 className="font-bold text-mint-1200 flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0"></span>
              Left Eye (OS)
            </h4>
            {/* Empty spacer to align with the 'Same for both eyes' button in the right eye column */}
            <div className="h-8 hidden md:block" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PrescriptionInput
              label="SPH (Sphere)"
              value={formData.left.SPH}
              onChange={(val) => handleEyeChange('left', 'SPH', val)}
              step={VALIDATION_RULES.SPH.step}
              min={VALIDATION_RULES.SPH.min}
              max={VALIDATION_RULES.SPH.max}
              placeholder="0"
              error={validationResults.errors['left.SPH']}
            />
            <PrescriptionInput
              label="CYL (Cylinder)"
              value={formData.left.CYL}
              onChange={(val) => handleEyeChange('left', 'CYL', val)}
              step={VALIDATION_RULES.CYL.step}
              min={VALIDATION_RULES.CYL.min}
              max={VALIDATION_RULES.CYL.max}
              placeholder="0"
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
              placeholder="0"
              error={validationResults.errors['left.ADD']}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 shrink-0">
          <PrescriptionInput
            label="Pupillary Distance (PD)"
            value={formData.PD}
            onChange={handlePDChange}
            step={VALIDATION_RULES.PD.step}
            min={VALIDATION_RULES.PD.min}
            max={VALIDATION_RULES.PD.max}
            placeholder="0 (e.g. 63)"
            error={validationResults.errors.PD}
          />
        </div>

        <div className="flex-1 w-full pt-4">
          {(parseFloat(formData.PD) > 0 && parseFloat(formData.PD) < 55) ||
          parseFloat(formData.PD) >= 75 ? (
            <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider">
                      Lưu ý về chỉ số PD
                    </p>
                    <p className="text-xs text-yellow-700 leading-relaxed">
                      Chỉ số PD của bạn có vẻ không nằm trong dải thông thường cho người lớn
                      (55-75mm). Vui lòng kiểm tra lại nếu đây là số đo cho trẻ em (khoảng 35-54mm).
                    </p>
                  </div>

                  <Checkbox
                    isChecked={pdConfirmed}
                    onCheckedChange={setPdConfirmed}
                    variant="yellow"
                    label="Tôi xác nhận số đo này là chính xác"
                    labelClassName="text-yellow-800"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {validationResults.warnings.length > 0 && (
        <div className="space-y-2 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <div className="flex items-center gap-2 text-orange-700 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Validation Warnings</span>
          </div>
          <ul className="space-y-1">
            {validationResults.warnings.map((warning, index) => (
              <li key={index} className="text-xs text-orange-600 flex items-start gap-2">
                <span className="mt-1 w-1 h-1 bg-orange-400 rounded-full shrink-0"></span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showDefaultCheckbox && (
        <div className="py-3">
          <Checkbox
            id="isDefault"
            isChecked={formData.isDefault}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked }))}
            label="Set as default prescription"
            labelClassName="text-mint-1200"
          />
        </div>
      )}

      {showConfirmCheckbox && (
        <div className="mt-4">
          <Checkbox
            isChecked={isConfirmed}
            onCheckedChange={setIsConfirmed}
            label={confirmText}
            labelClassName="text-gray-eyewear normal-case font-medium leading-relaxed"
          />
        </div>
      )}

      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-xs border-2"
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || (showConfirmCheckbox && !isConfirmed) || !isFormValid()}
          className={`flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
            !isFormValid()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-100'
          }`}
        >
          {isLoading
            ? 'Saving...'
            : submitLabel || (initialData ? 'Update Prescription' : 'Save Prescription')}
        </Button>
      </div>
    </form>
  )
}
