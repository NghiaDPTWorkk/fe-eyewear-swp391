import type { Address } from './address.types'
import type { Gender } from '@/shared/utils/enums/gender.enum'

/**
 * Customer types matching backend structure
 */

export interface LinkedAccount {
  provider: string
  providerId: string
  email?: string
}

export interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  gender: Gender
  address: Address[]
  hobbies: string[]
  isVerified: boolean
  linkedAccounts: LinkedAccount[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  deletedBy?: string | null
}

export interface CreateCustomerRequest {
  name: string
  email: string
  password: string
  phone: string
  gender: Gender
  address?: Address[]
  hobbies?: string[]
}

export interface UpdateCustomerRequest {
  name?: string
  email?: string
  password?: string
  phone?: string
  gender?: Gender
  address?: Address[]
  hobbies?: string[]
  isVerified?: boolean
}

export interface CustomerResponse {
  customer: Customer
}

export interface CustomerListResponse {
  items: Customer[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminCustomerParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface AdminCustomerListResponse {
  message: string
  data: {
    customers: Customer[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}
