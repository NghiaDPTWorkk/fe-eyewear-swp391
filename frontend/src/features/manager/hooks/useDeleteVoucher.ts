import { useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import { ENDPOINTS } from '@/api/endpoints'
import type { VoucherMutateResponse } from '@/shared/types'
import { toast } from 'react-hot-toast'

const QK = 'manager-vouchers'

export function useDeleteVoucher() {
  const qc = useQueryClient()
  return useMutation<VoucherMutateResponse, Error, string>({
    mutationFn: (id) =>
      httpClient.delete<VoucherMutateResponse>(ENDPOINTS.MANAGER.VOUCHER_DELETE(id)),
    onSuccess: (res) => {
      if (res.success) {
        toast.success('Voucher deleted successfully')
        qc.invalidateQueries({ queryKey: [QK] })
      } else {
        toast.error('Failed to delete voucher')
      }
    },
    onError: (err) => {
      toast.error(err.message || 'An error occurred')
    }
  })
}
