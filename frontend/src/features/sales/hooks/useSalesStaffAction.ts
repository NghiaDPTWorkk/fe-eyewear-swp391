import { useState } from 'react'
import { httpClient } from '@/api/apiClients'
import type { LensParameter } from '../types'

export const useSalesStaffAction = () => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyOrder = async (orderId: string | number, lensParameter: LensParameter) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/api/v1/orders/${orderId}`, { lensParameter })
      return true
    } catch (err: any) {
      setError(err.message || 'Verification failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  const rejectOrder = async (invoiceId: string | number) => {
    setProcessing(true)
    setError(null)
    try {
      await httpClient.patch(`/api/v1/invoices/${invoiceId}/cancel`)
      return true
    } catch (err: any) {
      setError(err.message || 'Rejection failed')
      return false
    } finally {
      setProcessing(false)
    }
  }

  return {
    verifyOrder,
    rejectOrder,
    processing,
    error
  }
}
