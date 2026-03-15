export interface AdminProductListItem {
  id: string
  nameBase: string
  slugBase: string
  skuBase: string
  type: string
  brand: string
  categories: string[]
  defaultVariantPrice: number
  defaultVariantFinalPrice: number
  defaultVariantImage: string
  totalVariants: number
  createdAt: string
}

export interface AdminProductListPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminProductListData {
  productList: AdminProductListItem[]
  pagination: AdminProductListPagination
}

export interface AdminProductListApiResponse {
  success: boolean
  message: string
  data: AdminProductListData
}

export interface AdminProductVariantOption {
  attributeId: string
  attributeName: string
  label: string
  showType: 'color' | 'text'
  value: string
}

export interface AdminProductVariant {
  mode: string
  sku: string
  name: string
  slug: string
  options: AdminProductVariantOption[]
  price: number
  finalPrice: number
  stock: number
  imgs: string[]
  isDefault: boolean
}

export interface AdminProductSpec {
  material?: string[]
  shape?: string
  style?: string
  gender?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }

  feature?: string[]
  origin?: string
}

export interface AdminProductDetail {
  nameBase: string
  slugBase: string
  skuBase: string
  brand: string
  categories: string[]
  variants: AdminProductVariant[]
  type: string
  spec: AdminProductSpec
}

export interface AdminProductDetailApiResponse {
  success: boolean
  message: string
  data: {
    product: AdminProductDetail
  }
}
