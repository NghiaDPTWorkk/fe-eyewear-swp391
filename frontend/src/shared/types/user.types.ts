import type { Address } from './address.types'

export interface User {
  _id: string
  email: string
  name: string
  phone: string
  gender: 'F' | 'M' | 'N'
  address: Address[]
  hobbies: string[]
  isVerified: boolean
  linkedAccounts?: Record<string, unknown>
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
