import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  PreOrderImportListApiResponse,
  ImportProductPayload,
  ImportProductApiResponse
} from '@/shared/types'
import { toast } from 'react-hot-toast'

export function usePreOrderImports(page: number = 1, limit: number = 10) {
  return useQuery<PreOrderImportListApiResponse>({
    queryKey: ['pre-order-imports', page, limit],
    queryFn: () =>
      httpClient.get<PreOrderImportListApiResponse>(ENDPOINTS.ADMIN.PRE_ORDER_IMPORTS(page, limit)),
    staleTime: 30_000
  })
}

export function useImportProduct() {
  const queryClient = useQueryClient()

  return useMutation<ImportProductApiResponse, Error, ImportProductPayload>({
    mutationFn: (payload) =>
      httpClient.post<ImportProductApiResponse>(ENDPOINTS.ADMIN.IMPORT_PRODUCTS, payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'Product imported successfully')
        queryClient.invalidateQueries({ queryKey: ['pre-order-imports'] })
        queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      } else {
        toast.error(response.message || 'Failed to import product')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred during product import')
    }
  })
}
