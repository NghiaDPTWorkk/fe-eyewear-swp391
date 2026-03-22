import { useState, useEffect, useMemo } from 'react'
import type { Prescription } from '@/shared/types/prescription.types'
import { Button } from '@/shared/components/ui/button'
import { Check, Copy, AlertCircle, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'

const VALIDATION_RULES = {
  SPH: { min: -20.0, max: 20.0, step: 0.25 },
  CYL: { min: -6.0, max: 0.0, step: 0.25 },
  AXIS: { min: 1, max: 180, step: 1 },
  ADD: { min: 0.75, max: 3.5, step: 0.25 },
  PD: { min: 35, max: 65, step: 0.5 }
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
    const pdRequirementMet = (pdNum >= 50 && pdNum <= 65) || (pdNum >= 35 && pdConfirmed)

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
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                SPH (Sphere)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.right.SPH}
                onChange={(e) => handleEyeChange('right', 'SPH', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['right.SPH'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['right.SPH'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['right.SPH']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                CYL (Cylinder)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.right.CYL}
                onChange={(e) => handleEyeChange('right', 'CYL', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['right.CYL'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['right.CYL'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['right.CYL']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                AXIS (degrees)
              </label>
              <input
                type="number"
                step="1"
                value={formData.right.AXIS}
                onChange={(e) => handleEyeChange('right', 'AXIS', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['right.AXIS'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder={parseFloat(formData.right.CYL) === 0 ? '—' : '0'}
                disabled={parseFloat(formData.right.CYL) === 0}
              />
              {validationResults.errors['right.AXIS'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['right.AXIS']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                ADD (Addition)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.right.ADD}
                onChange={(e) => handleEyeChange('right', 'ADD', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['right.ADD'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['right.ADD'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['right.ADD']}
                </p>
              )}
            </div>
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
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                SPH (Sphere)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.left.SPH}
                onChange={(e) => handleEyeChange('left', 'SPH', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['left.SPH'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['left.SPH'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['left.SPH']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                CYL (Cylinder)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.left.CYL}
                onChange={(e) => handleEyeChange('left', 'CYL', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['left.CYL'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['left.CYL'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['left.CYL']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                AXIS (degrees)
              </label>
              <input
                type="number"
                step="1"
                value={formData.left.AXIS}
                onChange={(e) => handleEyeChange('left', 'AXIS', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['left.AXIS'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder={parseFloat(formData.left.CYL) === 0 ? '—' : '0'}
                disabled={parseFloat(formData.left.CYL) === 0}
              />
              {validationResults.errors['left.AXIS'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['left.AXIS']}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                ADD (Addition)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.left.ADD}
                onChange={(e) => handleEyeChange('left', 'ADD', e.target.value)}
                className={`w-full bg-white border ${validationResults.errors['left.ADD'] ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
                placeholder="0"
              />
              {validationResults.errors['left.ADD'] && (
                <p className="text-[10px] text-red-500 font-medium">
                  {validationResults.errors['left.ADD']}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Pupillary Distance (PD)
          </label>
          <input
            type="number"
            step="0.5"
            value={formData.PD}
            onChange={(e) => handlePDChange(e.target.value)}
            className={`w-full bg-white border ${validationResults.errors.PD ? 'border-red-500' : 'border-gray-100'} rounded-xl px-2 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors text-center`}
            placeholder="0 (e.g. 63)"
          />
          {validationResults.errors.PD && (
            <p className="text-[10px] text-red-500 font-medium">{validationResults.errors.PD}</p>
          )}
          {parseFloat(formData.PD) > 0 && parseFloat(formData.PD) < 50 && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
              <Info className="w-3 h-3 text-yellow-600 shrink-0" />
              <div className="flex flex-col">
                <p className="text-[10px] text-yellow-700 font-medium">
                  Is this measurement for a child or an adult?
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setPdConfirmed(true)}
                    className={`text-[9px] px-2 py-0.5 rounded ${pdConfirmed ? 'bg-yellow-200 text-yellow-800' : 'bg-white text-yellow-600 hover:bg-yellow-100'}`}
                  >
                    Confirm accuracy
                  </button>
                </div>
              </div>
            </div>
          )}
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
        <div className="flex items-center gap-3 py-3">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
            className="w-5 h-5 rounded-lg border-gray-200 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="isDefault" className="text-sm font-bold text-mint-1200 cursor-pointer">
            Set as default prescription
          </label>
        </div>
      )}

      {showConfirmCheckbox && (
        <label className="flex items-start cursor-pointer mt-4">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <div className="mt-0.5 w-5 h-5 border-2 border-mint-300 rounded peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-all flex items-center justify-center shrink-0">
            <Check
              className={`w-3.5 h-3.5 text-white ${isConfirmed ? 'opacity-100' : 'opacity-0'} transition-opacity`}
            />
          </div>
          <span className="ml-3 text-sm text-gray-eyewear leading-relaxed">{confirmText}</span>
        </label>
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
