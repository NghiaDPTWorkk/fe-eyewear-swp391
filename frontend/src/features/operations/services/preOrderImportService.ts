import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/shared/types'

export type PreOrderImportStatus = 'PENDING' | 'DONE' | 'CANCELLED'

export interface PreOrderImport {
  _id: string
  sku: string
  description: string
  targetDate: string
  targetQuantity: number
  preOrderedQuantity: number
  managerResponsibility: string
  startedDate: string
  endedDate: string
  status: PreOrderImportStatus
  createdAt: string
  updatedAt: string
}

export interface PreOrderImportsResponse {
  success: boolean
  message: string
  data: {
    preOrderImports: PreOrderImport[]
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export const preOrderImportService = {
  /**
   * Get pre-order imports with optional status filtering and pagination
   * By default, filters for PENDING and DONE as requested by the user.
   */
  getPreOrderImports: async (params: {
    page?: number
    limit?: number
    status?: string[]
    search?: string
  } = {}) => {
    const { page = 1, limit = 10, status = ['PENDING', 'DONE'], search } = params
    
    // Construct query manually to handle multiple status parameters correctly if needed,
    // although httpClient might handle it if passed as part of ENDPOINTS.
    // Given the previous screenshot, the format is ?status=PENDING&status=DONE
    
    let url = ENDPOINTS.ADMIN.PRE_ORDER_IMPORTS(page, limit)
    const urlObj = new URL(url, window.location.origin)
    
    if (status && status.length > 0) {
      status.forEach(s => urlObj.searchParams.append('status', s))
    }
    
    if (search) {
      urlObj.searchParams.append('search', search)
    }

    return httpClient.get<PreOrderImportsResponse>(urlObj.pathname + urlObj.search)
  },

  getPreOrderImportDetail(id: string) {
    return httpClient.get<ApiResponse<PreOrderImport>>(ENDPOINTS.ADMIN.PRE_ORDER_IMPORT_DETAIL(id))
  },

  updatePreOrderImportStatus(id: string, status: string) {
    return httpClient.patch<ApiResponse<PreOrderImport>>(
      ENDPOINTS.ADMIN.PRE_ORDER_IMPORT_DETAIL(id),
      { status }
    )
  },

  importProduct(data: { sku: string; quantity: number; preOrderImportId: string }) {
    return httpClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.IMPORT_PRODUCTS, data)
  }
}
