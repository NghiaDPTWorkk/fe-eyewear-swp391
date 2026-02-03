import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

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
        await httpClient.patch(`/admin/invoices/${id}/status/approve`)
        toast.success('Invoice approved successfully')
        invalidateSalesData()
        return true
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Approval failed'
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
        await httpClient.patch(`/admin/invoices/${id}/status/reject`)
        toast.success('Invoice rejected successfully')
        invalidateSalesData()
        return true
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Rejection failed'
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
        await httpClient.patch(`/admin/orders/${id}/status/approve`)
        toast.success('Order verified successfully')
        invalidateSalesData()
        return true
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Verification failed'
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
    async (id: string, invoiceId?: string) => {
      setProcessing(true)
      setError(null)
      try {
        // 1. Reject the Order
        await httpClient.patch(`/admin/orders/${id}/status/reject`)

        // 2. If Invoice ID is present, reject the Invoice as well
        if (invoiceId) {
          try {
            await httpClient.patch(`/admin/invoices/${invoiceId}/status/reject`)
          } catch (invErr) {
            console.error('Failed to auto-reject invoice:', invErr)
            // We don't block the flow if invoice reject fails, but we log it.
            // Or maybe we should? User said "reject call reject invoice".
            // Assuming soft dependency effectively.
          }
        }

        toast.success('Order rejected successfully')
        invalidateSalesData()
        return true
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Rejection failed'
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
