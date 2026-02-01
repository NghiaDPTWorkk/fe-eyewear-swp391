import { ENDPOINTS, httpClient } from '@/api'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/shared/types'

// Khúc này nên đổi tên là service, không nên đặt tên như vầy
export const authApi = {
  loginCustomer(payload: LoginRequest) {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_CUSTOMER, payload)
  },

  loginStaff(payload: LoginRequest) {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_STAFF, payload)
  },

  register(payload: RegisterRequest) {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload)
  },

  getProfile() {
    return httpClient.get<User>(ENDPOINTS.AUTH.PROFILE)
  },

  getStaffProfile() {
    return httpClient.get<User>(ENDPOINTS.AUTH.PROFILE_STAFF)
  },

  refreshToken(payload: { refreshToken: string }) {
    return httpClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, payload)
  },

  logout() {
    return httpClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}
