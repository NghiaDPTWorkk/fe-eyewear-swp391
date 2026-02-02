import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AddressCard } from '@/components/layout/customer/account/addresses/AddressCard'
export function AddressesPage() {
  // In a real app, we'd fetch these.
  const [addresses] = useState([
    {
      street: '123 Nguyen Van Linh, District 7',
      ward: 'Tan Phong Ward',
      city: 'Ho Chi Minh City',
      isDefault: true
    },
    {
      street: '456 Le Loi, District 1',
      ward: 'Ben Nghe Ward',
      city: 'Ho Chi Minh City',
      isDefault: false
    }
  ])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[32px] font-bold text-mint-1200 mb-2">My Addresses</h2>
          <p className="text-gray-eyewear font-medium">
            Manage your delivery addresses for speedier checkout.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl uppercase tracking-widest text-xs">
          <Plus size={18} strokeWidth={3} />
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr, index) => (
          <AddressCard key={index} {...addr} />
        ))}

        {/* Placeholder/Add New Card */}
        <button className="p-6 border-2 border-dashed border-mint-200 rounded-3xl flex flex-col items-center justify-center min-h-[200px] hover:border-primary-400 hover:bg-primary-50/5 transition-all group">
          <div className="w-12 h-12 bg-mint-50 rounded-2xl flex items-center justify-center text-mint-300 mb-4 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors">
            <Plus size={24} strokeWidth={3} />
          </div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-primary-600 transition-colors">
            Add another delivery address
          </span>
        </button>
      </div>

      <div className="mt-12 bg-primary-50/30 p-8 rounded-3xl border border-primary-100/50">
        <h4 className="font-bold text-primary-900 mb-2">Why save multiple addresses?</h4>
        <p className="text-sm text-primary-700/70 leading-relaxed font-medium">
          Whether you're at home, the office, or sending a gift to a friend, saved addresses make
          your checkout experience seamless and accurate. Your information is protected by our
          secure systems.
        </p>
      </div>
    </div>
  )
}
