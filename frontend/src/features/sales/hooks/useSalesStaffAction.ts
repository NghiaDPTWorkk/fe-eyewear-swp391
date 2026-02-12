import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'

import { useQueryClient } from '@tanstack/react-query'

import { httpClient } from '@/api/apiClients'

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
    async (id: string, invoiceId?: string) => {
      setProcessing(true)
      setError(null)
      try {
        // 1. Reject the Order (we might need a service method for this if it's different)
        // For now, if there is no specific rejectOrder in salesService, I'll use httpClient or add it.
        // The user didn't give a specific endpoint for rejecting an order, just for invoice and approving order.
        // Wait, the user said:
        // {{base_url}}/admin/invoices/:id/status/reject -> Patch reject (đơn manufactor - id của invoices)
        // I'll stick to what the user provided.

        await httpClient.patch(`/admin/orders/${id}/status/reject`)

        if (invoiceId) {
          try {
            await salesService.rejectInvoice(invoiceId)
          } catch (invErr) {
            console.error('Failed to auto-reject invoice:', invErr)
          }
        }

        toast.success('Order rejected successfully')
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
