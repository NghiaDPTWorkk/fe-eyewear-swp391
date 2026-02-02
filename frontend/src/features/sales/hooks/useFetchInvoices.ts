import { useState, useCallback } from 'react'
import { invoiceService } from '../services/invoiceService'
import type { Invoice } from '../types'

export const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await invoiceService.getDepositedInvoices()
      setInvoices(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }, [])

  return { invoices, loading, error, fetchInvoices }
}
