import { useQuery } from '@tanstack/react-query'
import { salesService } from '../services/salesService'
import { transformOrder } from '../utils/orderUtils'

export function useSalesStaffOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['sales', 'order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required')
      const response = await salesService.getOrderById(orderId)
      const rawOrder = response.data?.order || (response as any).order

      if (!rawOrder) throw new Error('Order data not found')

      const rawOrderData = rawOrder as any
      const searchParams = new URLSearchParams(window.location.search)
      const urlInvoiceId = searchParams.get('invoiceId')

      const invoiceId =
        rawOrderData.invoiceId ||
        rawOrderData.invoice_id ||
        rawOrderData.invoice?.id ||
        rawOrderData.invoice?._id ||
        urlInvoiceId ||
        (typeof rawOrderData.invoice === 'string' ? rawOrderData.invoice : undefined)

      let fullInvoice = rawOrderData.invoice

      const needsFetch =
        !!invoiceId && (!fullInvoice || typeof fullInvoice === 'string' || !fullInvoice.fullName)

      if (needsFetch && typeof invoiceId === 'string') {
        try {
          const invRes = await salesService.getInvoiceById(invoiceId)
          const idata = invRes.data || (invRes as any)
          fullInvoice = idata?.invoice || idata || rawOrderData.invoice
        } catch (err) {
          console.error('Failed to fetch invoice details for order:', err)
        }
      }

      const hasEmail =
        fullInvoice?.email || fullInvoice?.customer?.email || fullInvoice?.owner?.email
      const ownerId =
        fullInvoice?.owner && typeof fullInvoice.owner === 'string'
          ? fullInvoice.owner
          : fullInvoice?.owner?.id || fullInvoice?.owner?._id

      if (!hasEmail && ownerId) {
        try {
          const customerRes = await salesService.getCustomerById(ownerId)
          const customerData = customerRes?.data?.customer || customerRes?.data
          if (customerData?.email) {
            fullInvoice = { ...fullInvoice, email: customerData.email }
          }
        } catch (err) {
          void err
        }
      }

      if (fullInvoice) {
        let formattedAddr = fullInvoice.address
        if (fullInvoice.address && typeof fullInvoice.address === 'object') {
          const a = fullInvoice.address as any
          formattedAddr = [a.street, a.ward, a.district, a.city].filter(Boolean).join(', ')
        }

        return {
          ...transformOrder(rawOrderData, fullInvoice),
          customerName:
            rawOrderData.customerName ||
            fullInvoice.fullName ||
            fullInvoice.fullNameVn ||
            fullInvoice.name ||
            fullInvoice.fullname ||
            rawOrderData.fullName,
          customerPhone:
            rawOrderData.customerPhone ||
            fullInvoice.phone ||
            fullInvoice.phoneNumber ||
            rawOrderData.phone,
          invoice: {
            ...fullInvoice,
            address: formattedAddr
          }
        }
      }

      return transformOrder(rawOrderData, fullInvoice)
    },
    enabled: !!orderId
  })
}
