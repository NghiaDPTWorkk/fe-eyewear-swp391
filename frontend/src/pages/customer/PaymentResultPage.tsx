import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Button, Container, Card } from '@/shared/components/ui'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import { useCartStore } from '@/store'
import type { InvoiceDetailData } from '@/shared/types/invoice.types'
import {
  PaymentStatusHeader,
  PaymentAmountCard,
  PaymentResultActions,
  PaymentFailureReasons,
  PaymentFooter
} from './components/PaymentResultComponents'
import { OrderItemList } from '@/components/layout/customer/account/orders/detail/OrderItemList'
import { OrderSummary } from '@/components/layout/customer/account/orders/detail/OrderSummary'
import { OrderCustomerDetails } from '@/components/layout/customer/account/orders/detail/OrderCustomerDetails'

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasHandledSuccess = useRef(false)

  useEffect(() => {
    const fetchResult = async () => {
      const responseCode = searchParams.get('vnp_ResponseCode')
      const txnRef = searchParams.get('vnp_TxnRef')
      const isSuccess = searchParams.get('isSuccess')
      const invoiceIdParam = searchParams.get('invoiceId')
      const payosStatus = searchParams.get('status')
      const payosOrderCode = searchParams.get('orderCode')

      let invoiceId = ''
      let isActuallySuccess = false

      if (txnRef) {
        invoiceId = txnRef.split('-')[1] || txnRef.split('-')[0]
        isActuallySuccess = responseCode === '00'
      } else if (payosStatus) {
        // Ưu tiên invoiceId (MongoID) để fetch detail, nếu không có mới dùng orderCode
        invoiceId = invoiceIdParam || payosOrderCode || ''
        isActuallySuccess = payosStatus === 'PAID'
      } else if (invoiceIdParam) {
        invoiceId = invoiceIdParam
        const isSuccessStr = isSuccess?.toLowerCase() || ''
        isActuallySuccess = isSuccessStr.startsWith('true') || isSuccessStr === '1'
      }

      if (!invoiceId) {
        setStatus('error')
        setError('Transaction information not found.')
        return
      }

      try {
        const response = await invoiceService.getInvoiceDetail(invoiceId)
        if (response.success) {
          setInvoiceData(response.data)
          if (isActuallySuccess) {
            setStatus('success')
            if (!hasHandledSuccess.current) {
              toast.success('Order payment successful!')

              // Remove only the purchased items from the cart
              const handleRemoveCheckedOutItems = async () => {
                const storedItemsStr = sessionStorage.getItem('pendingCheckoutItems')
                const isDirect = sessionStorage.getItem('pendingCheckoutIsDirect') === 'true'

                if (storedItemsStr && !isDirect) {
                  try {
                    const storedItems = JSON.parse(storedItemsStr)
                    const { clearCart, removeItems, items: currentItems } = useCartStore.getState()

                    if (storedItems.length === currentItems.length) {
                      await clearCart()
                    } else {
                      await removeItems(storedItems)
                    }
                  } catch (e) {
                    console.error('Failed to parse pending checkout items', e)
                  }
                }

                // Clear session storage securely
                sessionStorage.removeItem('pendingCheckoutItems')
                sessionStorage.removeItem('pendingCheckoutIsDirect')
              }
              handleRemoveCheckedOutItems()

              hasHandledSuccess.current = true
            }
          } else {
            setStatus('error')
            const errorMsg = responseCode
              ? `Transaction failed or cancelled (Error code: ${responseCode})`
              : 'Payment failed.'
            setError(errorMsg)
          }
        } else {
          setStatus('error')
          setError('Cannot get order information.')
        }
      } catch (err) {
        console.error('Error fetching invoice detail:', err)
        setStatus('error')
        setError('An error occurred while loading order information.')
      }
    }

    fetchResult()
    // params is derived from window.location.href which changes when navigation happens
  }, [searchParams])

  const amount = searchParams.get('vnp_Amount')
    ? Number(searchParams.get('vnp_Amount')) / 100
    : (invoiceData?.invoice.totalPrice || 0) + (invoiceData?.invoice.feeShip || 0)

  return (
    <div className="min-h-screen bg-mint-50 flex flex-col font-sans text-mint-1200">
      <CustomerHeader />

      <main className="flex-grow py-12 lg:py-20">
        <Container className="max-w-3xl">
          {status === 'loading' ? (
            <Card className="p-16 text-center border-none shadow-2xl rounded-[2.5rem] bg-white/90 backdrop-blur-md">
              <div className="space-y-8 animate-pulse">
                <div className="w-24 h-24 bg-mint-100 rounded-full mx-auto flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold">Confirming payment...</h1>
                  <p className="text-gray-500 text-lg">
                    Please do not close your browser or go back to the previous page.
                  </p>
                </div>
              </div>
            </Card>
          ) : status === 'success' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <PaymentStatusHeader status="success" />

              <PaymentAmountCard amount={amount} />

              <OrderCustomerDetails
                fullName={invoiceData?.invoice.fullName || ''}
                phone={invoiceData?.invoice.phone || ''}
                address={invoiceData?.invoice.address || { street: '', ward: '', city: '' }}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <OrderItemList items={invoiceData?.productList || []} />
                </div>
                <div>
                  <OrderSummary
                    totalPrice={invoiceData?.invoice.totalPrice || 0}
                    totalDiscount={invoiceData?.invoice.totalDiscount || 0}
                    feeShip={invoiceData?.invoice.feeShip || 0}
                  />
                </div>
              </div>

              <PaymentResultActions
                invoiceId={invoiceData?.invoice._id}
                onViewOrder={() => navigate(`/account/orders/${invoiceData?.invoice._id}`)}
                onNavigateHome={() => navigate('/')}
              />

              <PaymentFooter />
            </div>
          ) : (
            <div className="animate-in zoom-in duration-500 space-y-8">
              <PaymentStatusHeader status="error" error={error} />

              <div className="space-y-6">
                <PaymentFailureReasons />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/cart')}
                    className="h-14 rounded-2xl px-10 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg"
                  >
                    Retry cart
                  </Button>
                  <Button
                    onClick={() => navigate('/account/orders')}
                    variant="outline"
                    className="h-14 rounded-2xl px-10 border-2 border-mint-200 text-mint-1100 font-bold text-lg hover:bg-mint-50"
                  >
                    Order history
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
