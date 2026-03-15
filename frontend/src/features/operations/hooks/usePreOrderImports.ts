import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  preOrderImportService,
  type PreOrderImportsResponse
} from '../services/preOrderImportService'
import toast from 'react-hot-toast'

export function usePreOrderImports(
  params: {
    page?: number
    limit?: number
    status?: string[]
    search?: string
  } = {}
) {
  return useQuery<PreOrderImportsResponse>({
    queryKey: ['pre-order-imports', params],
    queryFn: () => preOrderImportService.getPreOrderImports(params),
    staleTime: 30_000
  })
}

export function usePreOrderImportDetail(id: string) {
  return useQuery({
    queryKey: ['pre-order-import-detail', id],
    queryFn: () => preOrderImportService.getPreOrderImportDetail(id),
    enabled: !!id,
    staleTime: 30_000
  })
}

/**
 * Hook to count all pre-order imports (filtering PENDING & DONE)
 */
export function useAllPreOrderImportsCount() {
  return useQuery<PreOrderImportsResponse>({
    queryKey: ['pre-order-imports', 'all-count'],
    queryFn: () => preOrderImportService.getPreOrderImports({ page: 1, limit: 1 }), // Just to get total count
    staleTime: 60_000
  })
}

export function useUpdatePreOrderImportStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      preOrderImportService.updatePreOrderImportStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-order-imports'] })
      queryClient.invalidateQueries({ queryKey: ['pre-order-import-detail'] })
      toast.success('Status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  })
}

export function useImportProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { sku: string; quantity: number; preOrderImportId: string }) =>
      preOrderImportService.importProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-order-imports'] })
      queryClient.invalidateQueries({ queryKey: ['pre-order-import-detail'] })
      toast.success('Inventory imported successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import inventory')
    }
  })
}
