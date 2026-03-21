import { ENDPOINTS, httpClient } from '@/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  ApiResponse
} from '@/shared/types'

export const authApi = {
  /**
   * Đăng nhập cho khách hàng
   * @param payload - Email và mật khẩu
   * @returns Thông tin định danh và token
   */
  loginCustomer: (payload: LoginRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_CUSTOMER, payload)
  },

  /**
   * Đăng nhập cho nhân viên
   * @param payload - Email và mật khẩu
   * @returns Thông tin định danh và token
   */
  loginStaff: (payload: LoginRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN_STAFF, payload)
  },

  /**
   * Đăng ký tài khoản khách hàng mới
   * @param payload - Thông tin đăng ký
   * @returns Thông tin tài khoản và token
   */
  register: (payload: RegisterRequest) => {
    return httpClient.post<LoginResponse>(ENDPOINTS.AUTH.REGISTER, payload)
  },

  /**
   * Lấy thông tin cá nhân của người dùng hiện tại
   * @returns Thông tin chi tiết khách hàng
   */
  getProfile: () => {
    return httpClient.get<ApiResponse<User>>(ENDPOINTS.AUTH.PROFILE)
  },

  /**
   * Lấy thông tin cá nhân của admin/staff
   * @returns Thông tin chi tiết admin/staff
   */
  getAdminProfile: () => {
    return httpClient.get<ApiResponse<any>>(ENDPOINTS.AUTH.GET_PROFILE)
  },

  updateProfile: (payload: { name: string; phone: string; gender: string }) => {
    return httpClient.patch<ApiResponse<User>>(ENDPOINTS.AUTH.UPDATE_PROFILE, payload)
  },

  changePasswordCustomer: (payload: { oldPassword?: string; newPassword: string }) => {
    return httpClient.patch<ApiResponse<any>>(ENDPOINTS.AUTH.CHANGE_PASSWORD_CUSTOMER, payload)
  },

  refreshToken() {
    return httpClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, undefined, {
      withCredentials: true
    })
  },

  /**
   * Yêu cầu nhập account phụ thuộc vào email đã tồn tại do Google Login
   */
  requestMergeAccount: (payload: { email: string; password?: string }) => {
    return httpClient.post<ApiResponse<any>>(ENDPOINTS.AUTH.REQUEST_MERGE, payload)
  },

  /**
   * Xác thực OTP quy trình merge account
   */
  verifyMergeOtp: (payload: { email: string; otp: string }) => {
    return httpClient.post<ApiResponse<any>>(ENDPOINTS.AUTH.VERIFY_MERGE_OTP, payload)
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout: () => {
    return httpClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}
