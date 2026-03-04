import { X } from 'lucide-react'
import { PrescriptionForm } from './PrescriptionForm'
import type { Prescription } from '@/shared/types/prescription.types'

interface PrescriptionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Prescription) => Promise<void>
  initialData?: Prescription
  isLoading?: boolean
  title?: string
  description?: string
  showDefaultCheckbox?: boolean
}

export function PrescriptionFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title,
  description,
  showDefaultCheckbox = true
}: PrescriptionFormModalProps) {
  if (!isOpen) return null

  const handleSubmit = async (formData: Prescription) => {
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error saving prescription:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <div>
            <h3 className="text-2xl font-bold text-mint-1200">
              {title || (initialData ? 'Update Prescription' : 'Add New Prescription')}
            </h3>
            <p className="text-gray-400 font-medium text-sm mt-1">
              {description ||
                (initialData ? 'Modify your vision details' : 'Save your vision details for later')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <PrescriptionForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            showDefaultCheckbox={showDefaultCheckbox}
          />
        </div>
      </div>
    </div>
  )
}
