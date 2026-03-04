import { useState, useEffect } from 'react'
import type { Prescription } from '@/shared/types/prescription.types'
import { Button } from '@/shared/components/ui/button'
import { Check } from 'lucide-react'

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
  const [formData, setFormData] = useState<Prescription>(
    initialData || {
      left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
      right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
      PD: 0,
      isDefault: false
    }
  )
  const [isConfirmed, setIsConfirmed] = useState(!showConfirmCheckbox)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleEyeChange = (eye: 'left' | 'right', field: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: numValue
      }
    }))
  }

  const handlePDChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData((prev) => ({
      ...prev,
      PD: numValue
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (showConfirmCheckbox && !isConfirmed) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right Eye */}
        <div className="space-y-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
          <h4 className="font-bold text-mint-1200 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            Right Eye (OD)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                SPH (Sphere)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.right.SPH}
                onChange={(e) => handleEyeChange('right', 'SPH', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                CYL (Cylinder)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.right.CYL}
                onChange={(e) => handleEyeChange('right', 'CYL', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                AXIS (degrees)
              </label>
              <input
                type="number"
                value={formData.right.AXIS}
                onChange={(e) => handleEyeChange('right', 'AXIS', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                ADD (Addition)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.right.ADD}
                onChange={(e) => handleEyeChange('right', 'ADD', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Left Eye */}
        <div className="space-y-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-100">
          <h4 className="font-bold text-mint-1200 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            Left Eye (OS)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                SPH (Sphere)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.left.SPH}
                onChange={(e) => handleEyeChange('left', 'SPH', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                CYL (Cylinder)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.left.CYL}
                onChange={(e) => handleEyeChange('left', 'CYL', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                AXIS (degrees)
              </label>
              <input
                type="number"
                value={formData.left.AXIS}
                onChange={(e) => handleEyeChange('left', 'AXIS', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                ADD (Addition)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.left.ADD}
                onChange={(e) => handleEyeChange('left', 'ADD', e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
                required
              />
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
            value={formData.PD}
            onChange={(e) => handlePDChange(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary-400 transition-colors"
            required
            placeholder="e.g. 63"
          />
        </div>

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
      </div>

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
          disabled={isLoading || (showConfirmCheckbox && !isConfirmed)}
          className="flex-1 rounded-2xl py-6 font-bold uppercase tracking-widest text-xs bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-100"
        >
          {isLoading
            ? 'Saving...'
            : submitLabel || (initialData ? 'Update Prescription' : 'Save Prescription')}
        </Button>
      </div>
    </form>
  )
}
