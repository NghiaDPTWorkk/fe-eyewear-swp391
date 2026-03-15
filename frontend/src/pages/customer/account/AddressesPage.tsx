import { useEffect, useState } from 'react'
import { Plus, MapPin, Loader2 } from 'lucide-react'
import { AddressCard } from '@/components/layout/customer/account/addresses/AddressCard'
import { useAddressStore } from '@/store/address.store'
import { AddAddressModal } from '@/components/layout/customer/account/addresses/AddAddressModal'

export function AddressesPage() {
  const { addresses, fetchAddresses, setDefaultAddress, isLoading, error } = useAddressStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[32px] font-bold text-mint-1200 mb-2">My Addresses</h2>
          <p className="text-gray-eyewear font-medium">
            Manage your delivery addresses for speedier checkout.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-xs"
        >
          <Plus size={18} strokeWidth={3} />
          Add New Address
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold">
          {error}
        </div>
      )}

      {isLoading && addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-mint-300">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="font-bold">Loading your addresses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              street={addr.street}
              ward={addr.ward}
              city={addr.city}
              isDefault={addr.isDefault}
              onSetDefault={() => addr._id && setDefaultAddress(addr._id, addr)}
            />
          ))}

          {}
          <button
            onClick={() => setIsModalOpen(true)}
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

      {!isLoading && addresses.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-mint-100 rounded-3xl bg-mint-50/10">
          <div className="w-16 h-16 bg-mint-50 rounded-2xl flex items-center justify-center text-mint-200 mb-4">
            <MapPin size={32} />
          </div>
          <p className="text-mint-400 font-bold mb-2">No addresses saved yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary-500 font-bold hover:underline"
          >
            Add your first address
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

      <AddAddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
