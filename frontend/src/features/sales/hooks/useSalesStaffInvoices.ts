import { useState, useCallback } from 'react'
import { httpClient } from '@/api/apiClients'
import type { Invoice } from '../types'

export const useSalesStaffInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await httpClient.get<any>('/invoices')
      const data = response.data?.data?.data || response.data?.data || []
      const deposited = Array.isArray(data)
        ? data.filter((inv: Invoice) => inv.status === 'DEPOSITED')
        : []
      setInvoices(deposited)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }, [])

  return { invoices, loading, error, fetchInvoices }
}
