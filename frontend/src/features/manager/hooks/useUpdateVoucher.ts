import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { VoucherPayload, VoucherMutateResponse } from '@/shared/types'
import { toast } from 'react-hot-toast'

const QK = 'manager-vouchers'

export function useUpdateVoucher() {
  const qc = useQueryClient()
  return useMutation<
    VoucherMutateResponse,
    Error,
    { id: string; payload: Partial<VoucherPayload> }
  >({
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
