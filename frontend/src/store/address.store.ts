import { create } from 'zustand'
import type { Address } from '@/shared/types'
import { customerAddressService } from '@/features/customer/services/customerAddress.service'

interface AddressState {
  addresses: Address[]
  isLoading: boolean
  error: string | null
  fetchAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, '_id'>) => Promise<void>
  updateAddress: (id: string, address: Omit<Address, '_id'>) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string, address: Address) => Promise<void>
  clearError: () => void
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null })
    try {
      const addresses = await customerAddressService.getAddresses()
      // Sort: Default first, then newest first
      const defaultAddr = addresses.find((a) => a.isDefault)
      const others = addresses.filter((a) => !a.isDefault).reverse()
      set({
        addresses: defaultAddr ? [defaultAddr, ...others] : others,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch addresses',
        isLoading: false
      })
    }
  },

  addAddress: async (addressData) => {
    set({ isLoading: true, error: null })
    try {
      await customerAddressService.addAddress(addressData)
      // Re-fetch all addresses to ensure state is in sync with backend (handles isDefault logic)
      const addresses = await customerAddressService.getAddresses()
      const defaultAddr = addresses.find((a) => a.isDefault)
      const others = addresses.filter((a) => !a.isDefault).reverse()
      set({
        addresses: defaultAddr ? [defaultAddr, ...others] : others,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add address',
        isLoading: false
      })
      throw error
    }
  },

  updateAddress: async (id, addressData) => {
    set({ isLoading: true, error: null })
    try {
      await customerAddressService.updateAddress(id, addressData)
      const addresses = await customerAddressService.getAddresses()
      const defaultAddr = addresses.find((a) => a.isDefault)
      const others = addresses.filter((a) => !a.isDefault).reverse()
      set({
        addresses: defaultAddr ? [defaultAddr, ...others] : others,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update address',
        isLoading: false
      })
      throw error
    }
  },
  deleteAddress: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await customerAddressService.deleteAddress(id)
      const addresses = await customerAddressService.getAddresses()
      const defaultAddr = addresses.find((a) => a.isDefault)
      const others = addresses.filter((a) => !a.isDefault).reverse()
      set({
        addresses: defaultAddr ? [defaultAddr, ...others] : others,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete address',
        isLoading: false
      })
      throw error
    }
  },

  setDefaultAddress: async (id, address) => {
    set({ isLoading: true, error: null })
    try {
      await customerAddressService.setDefaultAddress(id, { ...address, isDefault: true })
      // Re-fetch to sync
      const addresses = await customerAddressService.getAddresses()
      const defaultAddr = addresses.find((a) => a.isDefault)
      const others = addresses.filter((a) => !a.isDefault).reverse()
      set({
        addresses: defaultAddr ? [defaultAddr, ...others] : others,
        isLoading: false
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to set default address',
        isLoading: false
      })
      throw error
    }
  },

  clearError: () => set({ error: null })
}))
