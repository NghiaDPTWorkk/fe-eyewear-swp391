import type { Variant } from './variant.types'
import type { ProductType } from '@/shared/utils/enums/product.enum'
import type { Gender } from '@/shared/utils/enums/gender.enum'
export type { ProductType, Gender }

/**
 * Product spec types matching backend structure
 */
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

/**
 * Standard product interface - used for both list and detail views
 */
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
  // Optional fields for detail views
  variants?: Variant[]
  spec?: FrameSpec | LenSpec | null
  description?: string
  shortDescription?: string
  imageUrl?: string
  nameVariant?: string
}

/**
 * Product type alias for backward compatibility
 */
export type Product = StandardProduct

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
}

export interface ProductDetailApiResponse {
  success: boolean
  message: string
  data: ProductDetailData
}

/**
 * {
    "products": [
        {
            "product": {
                "product_id": "6965c4bc979f1a2fb5e32963",
                "sku": "LENS-007-01"
            },
            "quantity": 1
        }
    ],
    "address": {
        "street": "Le van viet",
        "ward": "Phuong Thu Duc",
        "city": "Thanh pho Ho Chi Minh"
    },
    "fullName": "Minh Lâm",
    "phone": "0812345678",
    "voucher": [],
    "paymentMethod": "COD",
    "note": "Giao ngoài giờ hành chánh dùm"
}
 */

export interface ProductInvoiceItemRequest {
  product: {
    product_id: string
    sku: string
  }
  quantity: number
}

/**
 * {
    "nameBase": "Premium Sunglasses",
    "categories": ["6965c4bc979f1a2fb5e32801"],
    "brand": "LuxuryBrand",
    "type": "sunglass",
    "gender": "UNISEX",
    "material": "Metal",
    "description": "High quality sunglasses",
    "shortDescription": "Best in class",
    "price": 1000000,
    "variants": []
}
    create product
 */
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
