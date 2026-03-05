import type { AttributeShowType } from '@/shared/utils/enums/attribute.enum'

/**
 * Attribute types matching backend structure
 */

export interface Attribute {
  _id: string
  name: string
  showType: AttributeShowType
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  createdBy: string
  deletedBy?: string | null
}

export interface CreateAttributeRequest {
  name: string
  showType: AttributeShowType
}

export interface UpdateAttributeRequest {
  name: string
  showType: AttributeShowType
}

export interface AttributeResponse {
  attribute: Attribute
}

export interface AttributeListResponse {
  items: Attribute[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
