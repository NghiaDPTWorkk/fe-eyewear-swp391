/**
 * Category types matching backend structure
 */

export interface Category {
  _id: string
  name: string
  parentCate: string | null
  thumbnail: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  deletedBy?: string | null
  createdBy?: string | null
}

export interface CreateCategoryRequest {
  name: string
  parentCate?: string | null
  thumbnail?: string | null
}

export interface UpdateCategoryRequest {
  name?: string
  parentCate?: string | null
  thumbnail?: string | null
}

export interface CategoryResponse {
  category: Category
}

export interface CategoryListResponse {
  items: Category[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
