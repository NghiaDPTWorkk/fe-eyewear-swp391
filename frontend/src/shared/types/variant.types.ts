/**
 * Product variant types matching backend structure
 */

export interface VariantOption {
  attributeId: string
  attributeName: string
  label: string
  showType: 'color' | 'text'
  value: string
}

export interface Variant {
  sku?: string
  name?: string
  slug?: string
  options: VariantOption[]
  price: number
  finalPrice: number
  stock: number
  imgs: string[]
  isDefault: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}
