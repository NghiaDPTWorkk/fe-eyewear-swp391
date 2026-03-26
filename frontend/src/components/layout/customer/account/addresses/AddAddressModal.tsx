import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useAddressStore } from '@/store/address.store'
import { AddressForm } from './AddressForm'
import type { Address } from '@/shared/types/address.types'
import { toast } from 'react-hot-toast'

interface AddAddressModalProps {
  isOpen: boolean
  onClose: () => void
  addressToEdit?: Address | null
}

export function AddAddressModal({ isOpen, onClose, addressToEdit }: AddAddressModalProps) {
  const { addAddress, updateAddress, isLoading } = useAddressStore()

  if (!isOpen) return null

  const isEditing = !!addressToEdit

  const handleSubmit = async (formData: {
    street: string
    ward: string
    city: string
    isDefault: boolean
  }) => {
    const promise =
      isEditing && addressToEdit?._id
        ? updateAddress(addressToEdit._id, formData)
        : addAddress(formData)

    toast.promise(promise, {
      loading: isEditing ? 'Updating address...' : 'Adding address...',
      success: isEditing ? 'Address updated successfully!' : 'Address added successfully!',
      error: (err) =>
        err?.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} address`
    })

    try {
      await promise
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-visible shadow-2xl animate-in zoom-in-95 duration-300 relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-mint-1200">
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <AddressForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            initialData={addressToEdit as any}
            submitLabel={isEditing ? 'Update Address' : 'Save Address'}
          />
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
