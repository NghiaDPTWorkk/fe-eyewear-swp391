import type { Variant } from './variant.types'
import type { ProductType, Gender } from './enums'

/**
 * Product spec types matching backend structure
 */
export interface FrameSpec {
  material: string[]
  shape: string
  style: string | null
  gender: Gender
  weight: number | null
  dimensions: {
    width: number
    height: number
    depth: number
  } | null
}

export interface LenSpec {
  feature: string[]
  origin: string | null
}

/**
 * Base product interface
 */
interface BaseProduct {
  _id: string
  nameBase: string
  slugBase: string
  skuBase: string
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
  | (BaseProduct & { type: 'lens'; spec: LenSpec | null })

/**
 * Standard product for list views (simplified)
 */
export interface StandardProduct {
  id: string
  nameBase: string
  slugBase: string
  skuBase: string
  type: ProductType
  brand: string | null
  categories: string[]
  defaultVariantPrice?: number
  defaultVariantFinalPrice?: number
  defaultVariantImage?: string
  totalVariants: number
  createdAt: string
}

/**
 * Product create request types
 */
interface BaseProductCreateRequest {
  nameBase: string
  slugBase?: string
  skuBase?: string
  brand: string | null
  categories: string[]
  variants: Variant[]
}

export type ProductCreateFrameRequest = BaseProductCreateRequest & {
  type: 'frame'
  spec: FrameSpec
}

export type ProductCreateSunglassRequest = BaseProductCreateRequest & {
  type: 'sunglass'
  spec: FrameSpec
}

export type ProductCreateLensRequest = BaseProductCreateRequest & {
  type: 'lens'
  spec: LenSpec | null
}

export type ProductCreateRequest =
  | ProductCreateFrameRequest
  | ProductCreateSunglassRequest
  | ProductCreateLensRequest

/**
 * Product update request types
 */
export interface ProductUpdateRequest {
  nameBase?: string
  slugBase?: string
  skuBase?: string
  type?: ProductType
  brand?: string | null
  categories?: string[]
  spec?: FrameSpec | LenSpec | null
  variants?: Variant[]
}

/**
 * Product search/filter request
 */
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

/**
 * Product API response with pagination
 */
export interface ProductResponse {
  data: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface StandardProductResponse {
  data: StandardProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}
