import { useState, useEffect, useCallback } from 'react'
import { Plus, ClipboardList, Loader2 } from 'lucide-react'
import { PrescriptionCard } from '@/components/layout/customer/account/prescriptions/PrescriptionCard'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { prescriptionService } from '@/features/customer/services/prescription.service'
import type { Prescription } from '@/shared/types/prescription.types'
import { PrescriptionFormModal } from '@/shared/components/prescription/PrescriptionFormModal'
import { toast } from 'react-hot-toast'

export function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState<Prescription | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await prescriptionService.getPrescriptions()
      const defaultPx = data.find((p) => p.isDefault)
      const others = data.filter((p) => !p.isDefault).reverse()
      setPrescriptions(defaultPx ? [defaultPx, ...others] : others)
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error)
      toast.error('Failed to load prescriptions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  const handleAddClick = () => {
    setEditingPrescription(undefined)
    setIsModalOpen(true)
  }

  const handleEditClick = (prescription: Prescription) => {
    setEditingPrescription(prescription)
    setIsModalOpen(true)
  }

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return

    const promise = prescriptionService.deletePrescription(id).then(() => fetchPrescriptions())

    toast.promise(promise, {
      loading: 'Deleting prescription...',
      success: 'Prescription deleted successfully!',
      error: 'Failed to delete prescription'
    })
  }

  const handleSubmit = async (data: Prescription) => {
    setIsSubmitting(true)
    const isUpdate = !!(editingPrescription && editingPrescription._id)
    const promise = isUpdate
      ? prescriptionService.updatePrescription(editingPrescription!._id!, data)
      : prescriptionService.addPrescription(data)

    toast.promise(promise, {
      loading: isUpdate ? 'Updating prescription...' : 'Saving prescription...',
      success: isUpdate ? 'Prescription updated successfully!' : 'Prescription added successfully!',
      error: 'Failed to save prescription'
    })

    try {
      await promise
      fetchPrescriptions()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to save prescription:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEmpty = prescriptions.length === 0

  if (isLoading && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
          Loading your prescriptions...
        </p>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[32px] font-bold text-mint-1200 mb-2">My Prescriptions</h2>
          <p className="text-gray-eyewear font-medium">
            Keep your vision details up to date for effortless shopping.
          </p>
        </div>
        {!isEmpty && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-xs"
          >
            <Plus size={18} strokeWidth={3} />
            Add Prescription
          </button>
        )}
      </div>

      {isEmpty ? (
        <Card className="p-16 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white shadow-sm rounded-[32px]">
          <div className="w-24 h-24 bg-mint-50 rounded-[32px] flex items-center justify-center text-mint-300 mb-8">
            <ClipboardList size={48} />
          </div>
          <p className="text-gray-eyewear font-medium text-lg mb-8 text-center max-w-sm">
            Looks like you have no prescriptions saved. Click "Add new prescription" below for
            speedier shopping.
          </p>
          <Button
            onClick={handleAddClick}
            className="rounded-2xl px-10 py-7 bg-primary-600 text-white font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all"
          >
            Add New Prescription
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {prescriptions.map((rx) => (
            <PrescriptionCard
              key={rx._id}
              prescription={rx}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}

          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-mint-200 rounded-[32px] hover:border-primary-400 hover:bg-primary-50/5 transition-all group mt-2"
          >
            <div className="w-10 h-10 bg-mint-50 rounded-xl flex items-center justify-center text-mint-300 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-primary-600 transition-colors uppercase tracking-widest">
              Save another prescription
            </span>
          </button>
        </div>
      )}

      {/* Info Tip */}
      <div className="mt-12 flex items-start gap-4 p-8 bg-mint-50/50 rounded-3xl border border-mint-100/50">
        <div className="mt-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
          !
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-mint-1200 mb-1">Your privacy matters</h4>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Your prescription data is encrypted and only used to fulfill your orders. We never share
            your health information with third parties.
          </p>
        </div>
      </div>

      <PrescriptionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingPrescription}
        isLoading={isSubmitting}
      />
    </div>
  )
}
