import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { salesService } from '../services/salesService'
import { showError, showSuccess, extractErrorMessage } from '../utils/errorHandler'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/shared/constants'

const DEFAULT_PARAMETERS = {
  left: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
  right: { SPH: 0, CYL: 0, AXIS: 0, ADD: 0 },
  PD: 64
}

const DEFAULT_APPROVE_NOTE = 'Nhớ làm nhanh dùm khách '

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
        showSuccess(SUCCESS_MESSAGES.SALES.INVOICE_APPROVED)
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = extractErrorMessage(err)
        setError(msg)
        showError(err)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectInvoice = useCallback(
    async (id: string, note?: string) => {
      setProcessing(true)
      setError(null)
      try {
        await salesService.rejectInvoice(id, note)
        showSuccess(SUCCESS_MESSAGES.SALES.INVOICE_REJECTED)
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = extractErrorMessage(err)
        setError(msg)
        showError(err)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const approveOrder = useCallback(
    async (id: string, data?: { parameters: Record<string, any>; note?: string }) => {
      setProcessing(true)
      setError(null)
      try {
        let finalData = data

        if (!finalData || !finalData.parameters) {
          const detailRes = await salesService.getOrderById(id)
          const order = detailRes?.data?.order
          const existingParameters = order?.products?.[0]?.lens?.parameters as
            | (Record<string, any> & { note?: string })
            | undefined

          finalData = {
            parameters: existingParameters || DEFAULT_PARAMETERS,
            note: DEFAULT_APPROVE_NOTE
          }
        }

        await salesService.approveOrder(id, {
          ...finalData,
          note: finalData?.note !== undefined ? finalData.note : DEFAULT_APPROVE_NOTE
        })
        showSuccess(SUCCESS_MESSAGES.SALES.ORDER_VERIFIED)
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = extractErrorMessage(err)
        setError(msg)
        showError(err)
        return false
      } finally {
        setProcessing(false)
      }
    },
    [invalidateSalesData]
  )

  const rejectOrder = useCallback(
    async (_id: string, invoiceId?: string, note?: string) => {
      setProcessing(true)
      setError(null)
      try {
        if (!invoiceId) {
          throw new Error(ERROR_MESSAGES.SALES.INVOICE_ID_NOT_FOUND)
        }

        await salesService.rejectInvoice(invoiceId, note)
        showSuccess(SUCCESS_MESSAGES.SALES.BATCH_REJECTED)
        invalidateSalesData()
        return true
      } catch (err: unknown) {
        const msg = extractErrorMessage(err)
        setError(msg)
        showError(err)
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
