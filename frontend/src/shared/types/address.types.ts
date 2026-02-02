/**
 * Address type matching backend structure
 */
export interface Address {
  _id?: string
  street: string
  ward: string
  city: string
  isDefault: boolean
}
