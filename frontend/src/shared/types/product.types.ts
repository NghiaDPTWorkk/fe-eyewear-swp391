export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  brand?: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isSale?: boolean
  salePrice?: number
  createdAt: Date
  updatedAt: Date
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
