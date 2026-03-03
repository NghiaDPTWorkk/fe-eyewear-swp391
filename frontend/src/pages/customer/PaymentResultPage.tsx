import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button, Container, Card } from '@/shared/components/ui'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'
import { invoiceService } from '@/features/customer/invoice/services/invoice.service'
import type { InvoiceDetailData } from '@/shared/types/invoice.types'
import {
  PaymentStatusHeader,
  PaymentAmountCard,
  TransactionDetails,
  OrderInvoiceDetails,
  PaymentResultActions,
  PaymentFailureReasons,
  PaymentFooter
} from './components/PaymentResultComponents'

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      const responseCode = searchParams.get('vnp_ResponseCode')
      const txnRef = searchParams.get('vnp_TxnRef') // Format: invoiceId-timestamp

      if (!txnRef) {
        setStatus('error')
        setError('Không tìm thấy thông tin giao dịch.')
        return
      }

      const invoiceId = txnRef.split('-')[0]

      try {
        const response = await invoiceService.getInvoiceDetail(invoiceId)
        if (response.success) {
          setInvoiceData(response.data)
          if (responseCode === '00') {
            setStatus('success')
          } else {
            setStatus('error')
            setError('Giao dịch không thành công hoặc đã bị hủy (Mã lỗi: ' + responseCode + ')')
          }
        } else {
          setStatus('error')
          setError('Không thể lấy thông tin đơn hàng.')
        }
      } catch (err) {
        console.error('Error fetching invoice detail:', err)
        setStatus('error')
        setError('Có lỗi xảy ra khi tải thông tin đơn hàng.')
      }
    }

    fetchResult()
  }, [searchParams])

  const paymentDate = searchParams.get('vnp_PayDate')
  const formattedDate = paymentDate
    ? `${paymentDate.slice(6, 8)}/${paymentDate.slice(4, 6)}/${paymentDate.slice(0, 4)}, ${paymentDate.slice(8, 10)}:${paymentDate.slice(10, 12)}`
    : new Date().toLocaleDateString('vi-VN')

  const amount = searchParams.get('vnp_Amount') ? Number(searchParams.get('vnp_Amount')) / 100 : 0

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
                  <h1 className="text-3xl font-bold">Đang xác nhận thanh toán...</h1>
                  <p className="text-gray-500 text-lg">
                    Vui lòng không đóng trình duyệt hoặc quay lại trang trước.
                  </p>
                </div>
              </div>
            </Card>
          ) : status === 'success' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <PaymentStatusHeader status="success" />

              <PaymentAmountCard amount={amount} />

              <TransactionDetails
                transactionNo={searchParams.get('vnp_TransactionNo')}
                formattedDate={formattedDate}
              />

              <OrderInvoiceDetails invoiceData={invoiceData} />

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
                    Thử lại giỏ hàng
                  </Button>
                  <Button
                    onClick={() => navigate('/account/orders')}
                    variant="outline"
                    className="h-14 rounded-2xl px-10 border-2 border-mint-200 text-mint-1100 font-bold text-lg hover:bg-mint-50"
                  >
                    Lịch sử đơn hàng
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
