import { X } from 'lucide-react'
import { useAddressStore } from '@/store/address.store'
import { AddressForm } from './AddressForm'
import type { Address } from '@/shared/types/address.types'

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
    try {
      if (isEditing && addressToEdit?._id) {
        await updateAddress(addressToEdit._id, formData)
      } else {
        await addAddress(formData)
      }
      onClose()
    } catch (error) {
      // Error is handled in the store
      console.log(error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
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
}
