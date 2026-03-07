import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  AdminVoucherListResponse,
  VoucherDetailResponse,
  VoucherPayload,
  VoucherMutateResponse
} from '@/shared/types'
import { toast } from 'react-hot-toast'

const QK = 'manager-vouchers'

/** GET /admin/vouchers — paginated list */
export function useManagerVouchers(page = 1, limit = 10, status?: string) {
  return useQuery<AdminVoucherListResponse>({
    queryKey: [QK, page, limit, status],
    queryFn: () =>
      httpClient.get<AdminVoucherListResponse>(ENDPOINTS.MANAGER.VOUCHERS(page, limit, status)),
    staleTime: 30_000
  })
}

/** GET /admin/vouchers/:id — lazy detail fetch (only runs when id is truthy) */
export function useVoucherDetail(id: string | null) {
  return useQuery<VoucherDetailResponse>({
    queryKey: [QK, 'detail', id],
    queryFn: () =>
      httpClient.get<VoucherDetailResponse>(ENDPOINTS.MANAGER.VOUCHER_DETAIL(id!)),
    enabled: !!id,
    staleTime: 0 // always re-fetch to get fresh data
  })
}

/** POST /admin/vouchers — create */
export function useCreateVoucher() {
  const qc = useQueryClient()
  return useMutation<VoucherMutateResponse, Error, VoucherPayload>({
    mutationFn: (payload) =>
      httpClient.post<VoucherMutateResponse>(ENDPOINTS.MANAGER.VOUCHER_CREATE, payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Voucher created successfully')
        qc.invalidateQueries({ queryKey: [QK] })
      } else {
        toast.error(res.message || 'Failed to create voucher')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'An error occurred')
    }
  })
}

/** PATCH /admin/vouchers/:id — update */
export function useUpdateVoucher() {
  const qc = useQueryClient()
  return useMutation<VoucherMutateResponse, Error, { id: string; payload: Partial<VoucherPayload> }>({
    mutationFn: ({ id, payload }) =>
      httpClient.patch<VoucherMutateResponse>(ENDPOINTS.MANAGER.VOUCHER_UPDATE(id), payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Voucher updated successfully')
        qc.invalidateQueries({ queryKey: [QK] })
      } else {
        toast.error(res.message || 'Failed to update voucher')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'An error occurred')
    }
  })
}

/** DELETE /admin/vouchers/:id */
export function useDeleteVoucher() {
  const qc = useQueryClient()
  return useMutation<VoucherMutateResponse, Error, string>({
    mutationFn: (id) =>
      httpClient.delete<VoucherMutateResponse>(ENDPOINTS.MANAGER.VOUCHER_DELETE(id)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Voucher deleted')
        qc.invalidateQueries({ queryKey: [QK] })
      } else {
        toast.error(res.message || 'Failed to delete voucher')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'An error occurred')
    }
  })
}
