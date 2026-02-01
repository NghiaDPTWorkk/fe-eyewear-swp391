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
   * Làm mới token truy cập
   * @param payload - Refresh token hiện tại
   * @returns Access token mới
   */
  refreshToken: (payload: { refreshToken: string }) => {
    return httpClient.post<{ accessToken: string }>(ENDPOINTS.AUTH.REFRESH_TOKEN, payload)
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout: () => {
    return httpClient.post(ENDPOINTS.AUTH.LOGOUT)
  }
}
