import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/api/apiClients'
import type { Invoice } from '../types'

export const useSalesStaffInvoices = () => {
  const {
    data: invoices = [],
    isLoading: loading,
    error,
    refetch: fetchInvoices
  } = useQuery({
    queryKey: ['sales', 'invoices'],
    queryFn: async () => {
      const response = await httpClient.get<any>('/admin/invoices/deposited')
      const rawData = response.data?.data || response.data || []

      // Parallelize checking orders for each invoice
      const mappedInvoices = await Promise.all(
        (Array.isArray(rawData) ? rawData : []).map(async (inv: any) => {
          const total = inv.orders?.length || 0
          let approved = 0

          if (inv.orders && inv.orders.length > 0) {
            try {
              // We need order details to check status
              // Optimization: Use Promise.all to fetch in parallel
              const orderPromises = inv.orders.map((o: any) =>
                httpClient.get(`/admin/orders/${o.id}`).catch(() => null)
              )
              const orderResults = await Promise.all(orderPromises)

              approved = orderResults.filter((res: any) => {
                if (!res) return false
                const order = res.data?.data?.order || res.data?.order || res.data?.data
                return (
                  order?.status === 'APPROVED' ||
                  order?.status === 'COMPLETED' ||
                  order?.status === 'VERIFIED'
                )
              }).length
            } catch (err) {
              console.error('Error fetching details for invoice', inv.id, err)
            }
          }

          return {
            ...inv,
            totalOrdersCount: total,
            approvedOrdersCount: approved
          } as Invoice
        })
      )

      return mappedInvoices
    },
    staleTime: 1000 * 60 * 1, // Cache for 1 minute
    refetchOnWindowFocus: true
  })

  return { invoices, loading, error: error ? (error as Error).message : null, fetchInvoices }
}
