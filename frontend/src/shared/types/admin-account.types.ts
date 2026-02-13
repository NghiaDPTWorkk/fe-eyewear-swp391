export interface AdminAccount {
  _id: string
  name: string
  citizenId: string
  phone: string
  email: string
  avatar: string
  role: string
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AdminAccountListApiResponse {
  success: boolean
  message: string
  data: {
    admins: AdminAccount[]
  }
}

export interface ProfileApiResponse {
  success: boolean
  message: string
  data: AdminAccount
}

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword?: string
  oldPassword?: string // API might use oldPassword instead of currentPassword, including both for safety or checking documentation
}

export interface GenericApiResponse {
  success: boolean
  message: string
}
