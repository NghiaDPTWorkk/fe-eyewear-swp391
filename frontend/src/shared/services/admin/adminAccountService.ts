import { ENDPOINTS, httpClient } from '@/api'
import type {
  AdminAccountDetailResponse,
  AdminAccountListApiResponse,
  AdminAccountListQueryParams,
  AdminAccountListResponse,
  CreateAdminAccountRequest,
  GenericApiResponse,
  UpdateAdminAccountRequest
} from '@/shared/types'

export const adminAccountService = {
  // Keep old endpoint/service for backward compatibility
  getAdmins(role?: string) {
    return httpClient.get<AdminAccountListApiResponse>(ENDPOINTS.ADMINS.GET_ADMIN(role))
  },

  getAdminAccounts(params: AdminAccountListQueryParams = {}) {
    const { page = 1, limit = 10, role, search } = params
    return httpClient.get<AdminAccountListResponse>(
      ENDPOINTS.ADMIN_ACCOUNTS.LIST(page, limit, role, search)
    )
  },

  getAdminAccountDetail(id: string) {
    return httpClient.get<AdminAccountDetailResponse>(ENDPOINTS.ADMIN_ACCOUNTS.DETAIL(id))
  },

  createAdminAccount(payload: CreateAdminAccountRequest) {
    return httpClient.post<AdminAccountDetailResponse>(ENDPOINTS.ADMIN_ACCOUNTS.CREATE, payload)
  },

  updateAdminAccount(id: string, payload: UpdateAdminAccountRequest) {
    return httpClient.patch<AdminAccountDetailResponse>(
      ENDPOINTS.ADMIN_ACCOUNTS.UPDATE(id),
      payload
    )
  },

  deleteAdminAccount(id: string) {
    return httpClient.delete<GenericApiResponse>(ENDPOINTS.ADMIN_ACCOUNTS.DELETE(id))
  }
}
