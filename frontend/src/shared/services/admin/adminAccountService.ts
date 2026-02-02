import { ENDPOINTS, httpClient } from '@/api'
import type { AdminAccountListApiResponse } from '@/shared/types'

export const adminAccountService = {
  getAdmins(role?: string) {
    return httpClient.get<AdminAccountListApiResponse>(ENDPOINTS.ADMINS.GET_ADMIN(role))
  }
}
