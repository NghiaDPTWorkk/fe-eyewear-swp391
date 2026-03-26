export interface ProfileRequest {
  _id: string
  staffId: string
  name: string
  email: string
  phone: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  processedAt: string | null
  processedBy: string | null
}

export interface ProfileRequestPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProfileRequestListResponse {
  success: boolean
  message: string
  data: {
    profileRequestList: ProfileRequest[]
    pagination: ProfileRequestPagination
  }
}

export interface ProfileRequestDetail {
  _id: string
  staffId: string
  name: string
  email: string
  phone: string
  status: string
  createdAt: string
  processedAt: string | null
  processedBy: string | null
}

export interface ProfileRequestDetailResponse {
  success: boolean
  message: string
  data: {
    profileRequestDetail: ProfileRequestDetail
  }
}
