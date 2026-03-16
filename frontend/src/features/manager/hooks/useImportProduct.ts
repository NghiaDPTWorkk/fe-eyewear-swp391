import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { ImportProductPayload, ImportProductApiResponse } from '@/shared/types'
import { toast } from 'react-hot-toast'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/shared/constants'

export function useImportProduct() {
  const queryClient = useQueryClient()

  return useMutation<ImportProductApiResponse, Error, ImportProductPayload>({
    mutationFn: (payload) =>
      httpClient.post<ImportProductApiResponse>(ENDPOINTS.ADMIN.IMPORT_PRODUCTS, payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || SUCCESS_MESSAGES.MANAGER.PRODUCT_IMPORTED)
        queryClient.invalidateQueries({ queryKey: ['pre-order-imports'] })
        queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      } else {
        toast.error(response.message || ERROR_MESSAGES.MANAGER.IMPORT_FAILED)
      }
    },
    onError: (error) => {
      toast.error(error.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR)
    }
  })
}
