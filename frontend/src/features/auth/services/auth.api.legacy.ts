import { ENDPOINTS, httpClient } from '@/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ApiResponse
} from '@/shared/types'

export const authApi = {
  loginCustomer: (payload: LoginRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_CUSTOMER, payload)
  },

  loginStaff: (payload: LoginRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_STAFF, payload)
  },

  register: (payload: RegisterRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload)
  },

  getProfile: () => {
    return httpClient.get<ApiResponse<User>>(ENDPOINTS.AUTH.PROFILE)
  },

  getAdminProfile: () => {
    return httpClient.get<ApiResponse<any>>(ENDPOINTS.AUTH.GET_PROFILE)
  },

  updateProfile: (payload: { name: string; phone: string; gender: string }) => {
    return httpClient.patch<ApiResponse<User>>(ENDPOINTS.AUTH.UPDATE_PROFILE, payload)
  },

  changePasswordCustomer: (payload: { oldPassword: string; newPassword: string }) => {
    return httpClient.patch<ApiResponse<any>>(ENDPOINTS.AUTH.CHANGE_PASSWORD_CUSTOMER, payload)
  },

  refreshToken() {
    return httpClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, undefined, {
      withCredentials: true
    })
  },

  logout: () => {
    return httpClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}
