import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types'
import { authApi } from './auth.api.legacy'

export const authService = {
  login: async (payload: LoginRequest) => {
    const response = await authApi.loginCustomer(payload)

    const accessToken = (response as any)?.accessToken ?? (response as any)?.token

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }

    return response
  },

  register: async (payload: RegisterRequest) => {
    const response = await authApi.register(payload)
    return response
  },

  getProfile: async (role?: string | null) => {
    const isStaff =
      role && ['SYSTEM_ADMIN', 'SALE_STAFF', 'MANAGER', 'OPERATION_STAFF'].includes(role)

    const response = isStaff ? await authApi.getAdminProfile() : await authApi.getProfile()
    return response.data
  },

  updateProfile: async (payload: { name: string; phone: string; gender: string }) => {
    const response = await authApi.updateProfile(payload)
    return response.data
  },

  changePasswordCustomer: async (payload: { oldPassword: string; newPassword: string }) => {
    const response = await authApi.changePasswordCustomer(payload)
    return response
  }
}
