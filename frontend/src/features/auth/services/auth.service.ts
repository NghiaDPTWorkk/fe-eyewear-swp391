import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { LoginRequest, RegisterRequest } from '@/shared/types'
import { authApi } from './auth.api.legacy'

export const authService = {
  /**
   * Đăng nhập cho khách hàng
   * @param payload - Thông tin đăng nhập
   * @returns Thông tin đăng nhập và tokens
   */
  login: async (payload: LoginRequest) => {
    const response = await authApi.loginCustomer(payload)

    // Extract tokens from response
    const accessToken = (response as any)?.accessToken ?? (response as any)?.token

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    }

    return response
  },

  /**
   * Đăng ký tài khoản mới
   * @param payload - Thông tin đăng ký
   * @returns Thông tin tài khoản mới
   */
  register: async (payload: RegisterRequest) => {
    const response = await authApi.register(payload)
    return response
  },

  getProfile: async (role?: string | null) => {
    const isStaff =
      role && ['SYSTEM_ADMIN', 'SALE_STAFF', 'MANAGER', 'OPERATION_STAFF'].includes(role)

    // Gọi đúng API tùy theo role
    const response = isStaff ? await authApi.getAdminProfile() : await authApi.getProfile()
    return response.data
  },

  updateProfile: async (payload: { name: string; phone: string; gender: string }) => {
    const response = await authApi.updateProfile(payload)
    return response.data
  },

  changePasswordCustomer: async (payload: { oldPassword?: string; newPassword: string }) => {
    const response = await authApi.changePasswordCustomer(payload)
    return response
  },

  requestMergeAccount: async (payload: { email: string; password?: string }) => {
    return await authApi.requestMergeAccount(payload)
  },

  verifyMergeOtp: async (payload: { email: string; otp: string }) => {
    return await authApi.verifyMergeOtp(payload)
  }
}
