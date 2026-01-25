import type { Variant } from './variant.types'

/**
 * Product spec types
 */
export interface FrameSpec {
  material: string
  shape: string
  color: string
  size: {
    width: number
    height: number
    bridge: number
  }
}

export interface LenSpec {
  lensType: string
  coating: string
  uvProtection: boolean
}

/**
 * Base product interface
 */
interface BaseProduct {
  _id: string
  nameBase: string
  slugBase: string
  skuBase: string
  description: string
  categories: string[]
  brand: string | null
  variants: Variant[]
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Product discriminated union
 */
export type Product =
  | (BaseProduct & { type: 'frame'; spec: FrameSpec })
  | (BaseProduct & { type: 'sunglass'; spec: FrameSpec })
  | (BaseProduct & { type: 'lens'; spec: LenSpec })

export interface ProductSearchRequest {
  keyword?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  isNew?: boolean
  isSale?: boolean
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
}
