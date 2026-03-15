import type { Variant } from './variant.types'
import type { ProductType } from '@/shared/utils/enums/product.enum'
import type { Gender } from '@/shared/utils/enums/gender.enum'
export type { ProductType, Gender }

export interface FrameSpec {
  material: string[]
  shape: string
  gender: Gender
  style?: string | null
  weight?: number | null
  dimensions?: { width: number; height: number; depth: number } | null
}

export interface LenSpec {
  feature: string[]
  origin: string | null
}

export interface StandardProduct {
  id: string
  _id?: string
  nameBase: string
  slugBase: string
  skuBase: string
  sku?: string
  type: ProductType
  brand: string | null
  categories: string[]
  defaultVariantPrice?: number
  defaultVariantFinalPrice?: number
  defaultVariantImage?: string
  totalVariants?: number
  createdAt?: string
  updatedAt?: Date
  deletedAt?: Date | null
  isDefault?: boolean

  variants?: Variant[]
  spec?: FrameSpec | LenSpec | null
  description?: string
  shortDescription?: string
  imageUrl?: string
  nameVariant?: string
}

export type Product = StandardProduct

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

export interface ProductListData {
  productList: StandardProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ProductListApiResponse {
  success: boolean
  message: string
  data: ProductListData
}

export interface ProductDetailData {
  product: Product
  variant?: Variant
}

export interface ProductDetailApiResponse {
  success: boolean
  message: string
  data: ProductDetailData
}

export interface ProductInvoiceItemRequest {
  product: {
    product_id: string
    sku: string
  }
  quantity: number
}

export interface CreateProductRequest {
  nameBase: string
  categories: string[]
  brand: string | null
  type: ProductType
  gender: Gender
  material: string
  description: string
  shortDescription: string
  price: number
  variants: Variant[]
}
