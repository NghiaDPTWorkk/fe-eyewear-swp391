import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import type { InvoiceDetailData } from '@/shared/types/invoice.types'
import { Loader2, ArrowLeft } from 'lucide-react'
import { OrderStatusTracker } from '@/components/layout/customer/account/orders/detail/OrderStatusTracker'
import { OrderItemList } from '@/components/layout/customer/account/orders/detail/OrderItemList'
import { OrderSummary } from '@/components/layout/customer/account/orders/detail/OrderSummary'
import { OrderCustomerDetails } from '@/components/layout/customer/account/orders/detail/OrderCustomerDetails'

export function CustomerOrderDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<InvoiceDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!invoiceId) return
      try {
        setIsLoading(true)
        const response = await invoiceService.getInvoiceDetail(invoiceId)
        if (response.success) {
          setData(response.data)
        } else {
          setError(response.message)
        }
      } catch (err: any) {
        setError('Failed to fetch order details. Please try again later.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [invoiceId])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-400 min-h-[500px]">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
        <p className="font-bold">Loading order details...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center">
        <p className="text-danger-500 font-bold mb-6">{error || 'Order not found'}</p>
        <Button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/account/orders'))}
          variant="outline"
          className="rounded-xl"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Orders
        </Button>
      </div>
    )
  }

  const { invoice, productList } = data

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/account/orders'))}
          className="p-3 hover:bg-mint-50 rounded-2xl text-mint-1200 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-mint-1200 mb-1">
            Order #{invoice.invoiceCode.replace('HD_', '')}
          </h2>
          <p className="text-gray-400 font-medium">
            Placed on {new Date(invoice.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <OrderStatusTracker status={invoice.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <OrderItemList items={productList} />

          {/* Notes */}
          {invoice.note && (
            <Card className="p-6 border-mint-100/50 bg-yellow-50/30">
              <h3 className="font-bold text-mint-1200 text-sm mb-2 flex items-center gap-2">
                <span className="text-lg">📝</span> Special Instructions
              </h3>
              <p className="text-sm text-gray-600 italic leading-relaxed">"{invoice.note}"</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <OrderSummary totalPrice={invoice.totalPrice} totalDiscount={invoice.totalDiscount} />
          <OrderCustomerDetails
            fullName={invoice.fullName}
            phone={invoice.phone}
            address={invoice.address}
          />
        </div>
      </div>
    </div>
  )
}
