import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

export interface Attribute {
  id: string
  name: string
  showType: 'color' | 'text'
  createdAt: string
}

interface AttributesResponse {
  success: boolean
  message: string
  data: {
    attributeList: Attribute[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export function useAttributes() {
  return useQuery({
    queryKey: ['attributes', 'list'],
    queryFn: async () => {
      const response = await httpClient.get<AttributesResponse>(ENDPOINTS.ADMIN.ATTRIBUTES)
      return response.data.attributeList
    }
  })
}
