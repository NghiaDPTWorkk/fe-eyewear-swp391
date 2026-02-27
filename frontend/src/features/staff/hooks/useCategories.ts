import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'

export interface CategoryNode {
  id: string
  name: string
  thumbnail: string | null
  children: CategoryNode[]
}

interface CategoriesTreeResponse {
  success: boolean
  message: string
  data: {
    categoryTree: CategoryNode[]
  }
}

export function useCategoriesTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const response = await httpClient.get<CategoriesTreeResponse>(ENDPOINTS.CATEGORIES.TREE)
      return response.data.categoryTree
    }
  })
}
