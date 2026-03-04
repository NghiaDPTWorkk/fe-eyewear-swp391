export interface AdminAccount {
  _id: string
  name: string
  citizenId: string
  phone: string
  email: string
  avatar: string | null
  role: string
  hashedPassword?: string
  deletedAt: string | null
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface AdminAccountListApiResponse {
  success: boolean
  message: string
  data: {
    admins: AdminAccount[]
  }
}

export interface AdminAccountPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminAccountListQueryParams {
  page?: number
  limit?: number
  role?: string
  search?: string
}

export interface AdminAccountListResponse {
  success: boolean
  message: string
  data: {
    adminAccounts: AdminAccount[]
    pagination: AdminAccountPagination
  }
}

export interface CreateAdminAccountRequest {
  name: string
  citizenId: string
  phone: string
  email: string
  password: string
  role: string
  avatar: string | null
}

export interface UpdateAdminAccountRequest {
  name?: string
  citizenId?: string
  phone?: string
  email?: string
  password?: string
  role?: string
  avatar?: string | null
}

export interface AdminAccountDetailResponse {
  success: boolean
  message: string
  data: AdminAccount | null
}

export interface ProfileApiResponse {
  success: boolean
  message: string
  data: AdminAccount
}

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword?: string
  oldPassword?: string
}

export interface GenericApiResponse {
  success: boolean
  message: string
  data?: null
}

export interface ProfileUpdateRequest {
  email: string
  phone: string
  name: string
}
