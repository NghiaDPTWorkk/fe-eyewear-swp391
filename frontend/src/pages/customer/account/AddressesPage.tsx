import { useEffect, useState } from 'react'
import { Plus, Loader2, MapPin } from 'lucide-react'
import { Card, Button } from '@/shared/components/ui'
import { AddressCard } from '@/components/layout/customer/account/addresses/AddressCard'
import { useAddressStore } from '@/store/address.store'
import { AddAddressModal } from '@/components/layout/customer/account/addresses/AddAddressModal'
import type { Address } from '@/shared/types/address.types'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '@/shared/components/ui-core/confirm-modal/ConfirmationModal'

export function AddressesPage() {
  const { addresses, fetchAddresses, setDefaultAddress, deleteAddress, isLoading, error } =
    useAddressStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleEdit = (addr: Address) => {
    setAddressToEdit(addr)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setAddressToEdit(null)
  }

  const handleDelete = async () => {
    if (!addressToDelete) return

    setIsDeleting(true)
    try {
      await toast.promise(deleteAddress(addressToDelete), {
        loading: 'Deleting address...',
        success: 'Address deleted successfully!',
        error: (err) => err?.response?.data?.message || 'Failed to delete address'
      })
      setAddressToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const isEmpty = addresses.length === 0

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[32px] font-bold text-mint-1200 mb-2">My Addresses</h2>
          <p className="text-gray-eyewear font-medium">
            Manage your delivery addresses for speedier checkout.
          </p>
        </div>
        {!isEmpty && (
          <button
            onClick={() => {
              setAddressToEdit(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-xs"
          >
            <Plus size={18} strokeWidth={3} />
            Add New Address
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
          {error}
        </div>
      )}

      {isLoading && isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-mint-300">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="font-bold">Loading your addresses...</p>
        </div>
      ) : isEmpty ? (
        <Card className="p-16 flex flex-col items-center justify-center border-dashed border-2 border-mint-100 bg-white shadow-sm rounded-[32px]">
          <div className="w-24 h-24 bg-mint-50 rounded-[32px] flex items-center justify-center text-mint-300 mb-8">
            <MapPin size={48} />
          </div>
          <p className="text-gray-eyewear font-medium text-lg mb-8 text-center max-w-sm leading-relaxed">
            Looks like you have no addresses saved yet. Add your first address below for speedier
            checkout.
          </p>
          <Button
            onClick={() => {
              setAddressToEdit(null)
              setIsModalOpen(true)
            }}
            className="rounded-2xl px-10 py-7 bg-primary-600 text-white font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-heading"
          >
            Add your first address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              street={addr.street}
              ward={addr.ward}
              city={addr.city}
              isDefault={addr.isDefault}
              onEdit={() => handleEdit(addr)}
              onDelete={() => addr._id && setAddressToDelete(addr._id)}
              onSetDefault={() => {
                if (addr._id) {
                  toast.promise(setDefaultAddress(addr._id, addr), {
                    loading: 'Setting as default...',
                    success: 'Default address updated!',
                    error: 'Failed to update default address'
                  })
                }
              }}
            />
          ))}

          {/* Add New Card */}
          <button
            onClick={() => {
              setAddressToEdit(null)
              setIsModalOpen(true)
            }}
            className="p-6 border-2 border-dashed border-mint-200 rounded-3xl flex flex-col items-center justify-center min-h-[200px] hover:border-primary-400 hover:bg-primary-50/5 transition-all group"
          >
            <div className="w-12 h-12 bg-mint-50 rounded-2xl flex items-center justify-center text-mint-300 mb-4 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-primary-600 transition-colors">
              Add another delivery address
            </span>
          </button>
        </div>
      )}

      <div className="mt-12 bg-primary-50/30 p-8 rounded-3xl border border-primary-100/50">
        <h4 className="font-bold text-primary-900 mb-2">Why save multiple addresses?</h4>
        <p className="text-sm text-primary-700/70 leading-relaxed font-medium">
          Whether you're at home, the office, or sending a gift to a friend, saved addresses make
          your checkout experience seamless and accurate. Your information is protected by our
          secure systems.
        </p>
      </div>

      <AddAddressModal isOpen={isModalOpen} onClose={handleClose} addressToEdit={addressToEdit} />

      <ConfirmationModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action is IRREVERSIBLE."
        confirmText="Delete"
        isLoading={isDeleting}
        type="danger"
      />
    </div>
  )
}
