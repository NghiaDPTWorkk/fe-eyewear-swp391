import { Home, MapPin, ChevronDown, Check, Plus } from 'lucide-react'
import { Select, Input } from '@/shared/components/ui'
import type { Address } from '@/shared/types'
import type { Province, Ward } from '@/shared/services/addressService'

interface ShippingAddressSectionProps {
  address: {
    street: string
    ward: string
    city: string
  }
  addressMode: 'list' | 'manual'
  savedAddresses: Address[]
  selectedAddressId: string
  isAddressDropdownOpen: boolean
  provinces: Province[]
  wards: Ward[]
  selectedProvinceCode: number | null
  onModeChange: (mode: 'list' | 'manual') => void
  onDropdownToggle: (isOpen: boolean) => void
  onSavedAddressChange: (id: string) => void
  onProvinceChange: (code: number, name: string) => void
  onAddressUpdate: (updates: Partial<{ street: string; ward: string; city: string }>) => void
}

export const ShippingAddressSection = ({
  address,
  addressMode,
  savedAddresses,
  selectedAddressId,
  isAddressDropdownOpen,
  provinces,
  wards,
  selectedProvinceCode,
  onModeChange,
  onDropdownToggle,
  onSavedAddressChange,
  onProvinceChange,
  onAddressUpdate
}: ShippingAddressSectionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-primary-500" />
          Shipping Address
        </div>
        {addressMode === 'manual' && savedAddresses.length > 0 && (
          <button
            onClick={() => onModeChange('list')}
            className="text-xs font-bold text-primary-500 hover:text-primary-600 underline"
          >
            Back to saved
          </button>
        )}
      </h2>

      {addressMode === 'list' ? (
        <div className="space-y-4">
          <div className="relative">
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1.5 block ml-1">
              Deliver to
            </label>

            <button
              type="button"
              onClick={() => onDropdownToggle(!isAddressDropdownOpen)}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left bg-white ${
                isAddressDropdownOpen
                  ? 'border-primary-500 shadow-md ring-4 ring-primary-500/10'
                  : 'border-mint-200 hover:border-mint-300 shadow-sm'
              }`}
            >
              <div className="mt-0.5 p-2 rounded-xl bg-primary-50">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-mint-1200 truncate">
                    {address.street || 'Select an address'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-eyewear transition-transform duration-300 ${isAddressDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                <p className="text-xs text-gray-eyewear truncate mt-0.5">
                  {address.ward}, {address.city}
                </p>
              </div>
            </button>

            {isAddressDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => onDropdownToggle(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-mint-200 shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {savedAddresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => {
                          onSavedAddressChange(addr._id || '')
                          onDropdownToggle(false)
                        }}
                        className={`w-full flex items-start gap-3 p-4 hover:bg-mint-50/50 transition-colors text-left border-b border-mint-100 last:border-0 ${
                          selectedAddressId === addr._id ? 'bg-primary-50/30' : ''
                        }`}
                      >
                        <div
                          className={`mt-0.5 p-1.5 rounded-lg ${selectedAddressId === addr._id ? 'bg-primary-500 text-white' : 'bg-mint-100/50 text-gray-eyewear'}`}
                        >
                          {selectedAddressId === addr._id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <MapPin className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`font-bold text-sm ${selectedAddressId === addr._id ? 'text-primary-600' : 'text-mint-1200'}`}
                            >
                              {addr.street}
                            </span>
                            {addr.isDefault && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-mint-200/50 text-mint-700 font-bold uppercase tracking-wider">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-eyewear">
                            {addr.ward}, {addr.city}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSavedAddressChange('new')
                      onDropdownToggle(false)
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-mint-50/30 hover:bg-mint-100/50 transition-colors text-left border-t border-mint-100"
                  >
                    <div className="p-1.5 rounded-lg bg-white border border-mint-200 text-primary-500">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-bold text-primary-600">Enter a new address</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 px-1 text-[11px] text-gray-eyewear italic">
            <Check className="w-3 h-3 text-primary-500" />
            <span>Items will be shipped to this location</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              City / Province
            </label>
            <Select
              value={selectedProvinceCode || ''}
              onChange={(e) => {
                const code = Number(e.target.value)
                const province = provinces.find((p) => p.code === code)
                if (province) onProvinceChange(code, province.name)
              }}
              placeholder="Select Province"
              className="rounded-xl border-mint-200 focus-within:border-primary-500"
            >
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">Ward</label>
            <Select
              value={address.ward}
              onChange={(e) => onAddressUpdate({ ward: e.target.value })}
              placeholder="Select Ward"
              isDisabled={!selectedProvinceCode}
              className="rounded-xl border-mint-200 focus-within:border-primary-500"
            >
              {(wards || []).map((w) => (
                <option key={w.code} value={w.name}>
                  {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-eyewear uppercase mb-1 block">
              Street
            </label>
            <Input
              value={address.street}
              onChange={(e) => onAddressUpdate({ street: e.target.value })}
              placeholder="e.g. Le van viet"
              className="rounded-xl border-mint-200 focus:border-primary-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
