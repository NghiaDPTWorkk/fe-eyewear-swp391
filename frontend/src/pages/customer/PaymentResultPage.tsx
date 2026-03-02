import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button, Container, Card } from '@/shared/components/ui'
import CustomerHeader from '@/components/layout/customer/header/CustomerHeader'
import { Footer } from '@/components/layout/customer/homepage/components'

export const PaymentResultPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // VNPay Response Code 00 means Success
    const responseCode = searchParams.get('vnp_ResponseCode')
    const transactionStatus = searchParams.get('vnp_TransactionStatus')

    if (responseCode === '00' && transactionStatus === '00') {
      setStatus('success')
      setMessage('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.')
    } else {
      setStatus('error')
      setMessage('Giao dịch không thành công hoặc đã bị hủy.')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-mint-50 flex flex-col">
      <CustomerHeader />

      <main className="flex-grow py-20">
        <Container className="max-w-2xl">
          <Card className="p-12 text-center border-none shadow-xl rounded-3xl bg-white/80 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
            {status === 'loading' ? (
              <div className="space-y-6">
                <Loader2 className="w-20 h-20 text-primary-500 animate-spin mx-auto" />
                <h1 className="text-3xl font-bold text-mint-1200">Đang xác nhận thanh toán...</h1>
                <p className="text-gray-500">
                  Vui lòng không đóng trình duyệt hoặc quay lại trang trước.
                </p>
              </div>
            ) : status === 'success' ? (
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-success-200/20 blur-3xl rounded-full scale-150" />
                  <CheckCircle2 className="w-24 h-24 text-success-500 mx-auto relative animate-bounce-slow" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-mint-1200">Thanh toán thành công</h1>
                  <p className="text-lg text-gray-600 max-w-md mx-auto">{message}</p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/account/orders')}
                    className="h-14 rounded-2xl px-8 bg-mint-1200 hover:bg-mint-1100 text-white font-bold text-lg shadow-lg shadow-mint-200"
                  >
                    Xem đơn hàng <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => navigate('/products')}
                    variant="outline"
                    className="h-14 rounded-2xl px-8 border-2 border-mint-200 text-mint-1200 font-bold text-lg hover:bg-mint-50"
                  >
                    Tiếp tục mua sắm <ShoppingBag className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-danger-200/20 blur-3xl rounded-full scale-150" />
                  <XCircle className="w-24 h-24 text-danger-500 mx-auto relative" />
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-mint-1200">Thanh toán thất bại</h1>
                  <p className="text-lg text-gray-600">{message}</p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/cart')}
                    className="h-14 rounded-2xl px-8 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-lg shadow-primary-100"
                  >
                    Quay lại giỏ hàng
                  </Button>
                  <Button
                    onClick={() => navigate('/account/orders')}
                    variant="outline"
                    className="h-14 rounded-2xl px-8 border-2 border-mint-200 text-mint-1200 font-bold text-lg hover:bg-mint-50"
                  >
                    Xem lịch sử đơn hàng
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
