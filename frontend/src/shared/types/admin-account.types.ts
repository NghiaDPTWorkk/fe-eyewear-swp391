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
