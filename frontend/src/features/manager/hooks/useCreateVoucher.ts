import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { VoucherPayload, VoucherMutateResponse } from '@/shared/types'
import { toast } from 'react-hot-toast'

const QK = 'manager-vouchers'

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
