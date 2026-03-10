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
  status: 'PENDING' | 'DONE'
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PreOrderImportPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PreOrderImportListApiResponse {
  success: boolean
  message: string
  data: {
    preOrderImports: PreOrderImport[]
    pagination: PreOrderImportPagination
  }
}

export interface ImportProductPayload {
  sku: string
  quantity: number
  preOrderImportId: string
}

export interface ImportProductApiResponse {
  success: boolean
  message: string
  data: null
}
