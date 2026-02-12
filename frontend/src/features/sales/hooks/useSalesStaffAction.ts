import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'

import { useQueryClient } from '@tanstack/react-query'

import { salesService } from '../services/salesService'

export const useSalesStaffAction = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const invalidateSalesData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['sales'] })
  }, [queryClient])

  const approveInvoice = useCallback(
    async (id: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.approveInvoice(id)
        toast.success('Invoice approved successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        const msg = error.response?.data?.message || error.message || 'Approval failed'
        setError(msg)
        toast.error(msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectInvoice = useCallback(
    async (id: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.rejectInvoice(id)
        toast.success('Invoice rejected successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        const msg = error.response?.data?.message || error.message || 'Rejection failed'
        setError(msg)
        toast.error(msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const approveOrder = useCallback(
    async (id: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.approveOrder(id)
        toast.success('Order verified successfully')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        const msg = error.response?.data?.message || error.message || 'Verification failed'
        setError(msg)
        toast.error(msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectOrder = useCallback(
    async (_id: string, invoiceId?: string) => {
      setProcessing(true)
      setError(null)
      try {
        if (!invoiceId) {
          throw new Error('Associated invoice ID not found')
        }

        // Rejecting any order in the invoice triggers rejection of the entire invoice
        await salesService.rejectInvoice(invoiceId)

        toast.success('Invoice and all associated orders rejected')
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        const msg = error.response?.data?.message || error.message || 'Rejection failed'
        setError(msg)
        toast.error(msg)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  return {
    approveInvoice,
    rejectInvoice,
    approveOrder,
    rejectOrder,
    processing,
    error
  }
}
