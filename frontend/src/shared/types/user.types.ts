import type { Address } from './address.types'

export interface User {
  _id: string
  email: string
  name: string
  fullName?: string
  phone?: string
  gender?: 'F' | 'M' | 'N' | string
  address?: Address[]
  hobbies?: string[]
  isVerified?: boolean
  linkedAccounts?: any
  providers?: string[] // local, google, etc.
  deletedAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}
