import {
  CheckCircle2,
  XCircle,
  Receipt,
  Download,
  Calendar,
  CreditCard,
  Hash,
  ShoppingBag,
  Home,
  AlertCircle
} from 'lucide-react'
import { Button, Card } from '@/shared/components/ui'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import type { InvoiceDetailData } from '@/shared/types/invoice.types'
import { Link } from 'react-router-dom'

interface PaymentStatusHeaderProps {
  status: 'success' | 'error'
  error?: string | null
}

export const PaymentStatusHeader = ({ status, error }: PaymentStatusHeaderProps) => {
  if (status === 'success') {
    return (
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-success-200/30 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="bg-success-500 text-white p-4 rounded-full shadow-lg shadow-success-200 relative">
            <CheckCircle2 className="w-16 h-16" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Thanh toán thành công!</h1>
          <p className="text-lg text-mint-800/70 font-medium">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="bg-danger-500 text-white p-4 rounded-full inline-block shadow-lg shadow-danger-200">
        <XCircle className="w-16 h-16" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-danger-600">Thanh toán thất bại</h1>
        <p className="text-lg text-mint-800/70 font-medium">
          {error || 'Giao dịch không thành công hoặc đã bị hủy.'}
        </p>
      </div>
    </div>
  )
}

interface PaymentAmountCardProps {
  amount: number
}

export const PaymentAmountCard = ({ amount }: PaymentAmountCardProps) => (
  <Card className="p-8 border-none shadow-xl rounded-3xl bg-white text-center border-t-4 border-success-500 relative overflow-hidden group">
    <div className="space-y-3 relative z-10">
      <p className="text-mint-800/60 font-semibold uppercase tracking-wider text-sm">
        Tổng số tiền đã thanh toán
      </p>
      <div className="text-5xl font-black text-success-600 tracking-tight group-hover:scale-105 transition-transform duration-500">
        <VNDPrice amount={amount} />
      </div>
    </div>
    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-success-50 rounded-full blur-2xl opacity-50" />
  </Card>
)

interface TransactionDetailsProps {
  transactionNo: string | null
  formattedDate: string
}

export const TransactionDetails = ({ transactionNo, formattedDate }: TransactionDetailsProps) => (
  <Card className="p-8 border-none shadow-xl rounded-3xl bg-white space-y-6">
    <div className="flex items-center gap-3 pb-4 border-b border-mint-50">
      <div className="bg-mint-100 p-2 rounded-xl text-mint-700">
        <Receipt className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold">Thông tin giao dịch</h2>
    </div>
    <div className="grid gap-5 text-base">
      <div className="flex justify-between items-center group">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <Hash className="w-4 h-4" /> Mã giao dịch
        </div>
        <span className="font-bold text-mint-1100 bg-mint-50 px-3 py-1 rounded-lg">
          TXN-{transactionNo || 'N/A'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <Calendar className="w-4 h-4" /> Ngày thanh toán
        </div>
        <span className="font-semibold text-mint-1000">{formattedDate}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <CreditCard className="w-4 h-4" /> Phương thức thanh toán
        </div>
        <span className="font-semibold text-mint-1000">Thẻ ATM / Tài khoản ngân hàng</span>
      </div>
    </div>
  </Card>
)

interface OrderInvoiceDetailsProps {
  invoiceData: InvoiceDetailData | null
}

export const OrderInvoiceDetails = ({ invoiceData }: OrderInvoiceDetailsProps) => (
  <Card className="p-8 border-none shadow-xl rounded-3xl bg-white space-y-6">
    <div className="flex items-center gap-3 pb-4 border-b border-mint-50">
      <div className="bg-mint-100 p-2 rounded-xl text-mint-700">
        <ShoppingBag className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>
    </div>

    <div className="space-y-6">
      {invoiceData?.productList.map((item, idx) => {
        const product = item.product || item.lens
        if (!product) return null
        return (
          <div key={idx} className="flex justify-between items-start group">
            <div className="space-y-1">
              <p className="font-bold text-mint-1100 group-hover:text-primary-600 transition-colors">
                {product.detail.name}
              </p>
            </div>
            <div className="font-bold text-mint-1100">
              <VNDPrice amount={product.pricePerUnit} />
            </div>
          </div>
        )
      })}
    </div>

    <div className="pt-6 border-t border-dashed border-mint-200 space-y-4">
      <div className="flex justify-between text-mint-800/70 font-medium">
        <span>Tạm tính</span>
        <VNDPrice amount={invoiceData?.invoice.totalPrice || 0} />
      </div>
      <div className="flex justify-between text-mint-800/70 font-medium">
        <span>Phí vận chuyển</span>
        <span className="text-success-600">Miễn phí</span>
      </div>
      <div className="flex justify-between text-2xl font-black text-mint-1200 pt-2">
        <span>Tổng cộng</span>
        <div className="text-primary-600 tracking-tight">
          <VNDPrice amount={invoiceData?.invoice.totalPrice || 0} />
        </div>
      </div>
    </div>
  </Card>
)

interface PaymentResultActionsProps {
  invoiceId: string | undefined
  onNavigateHome: () => void
  onViewOrder: () => void
}

export const PaymentResultActions = ({
  onNavigateHome,
  onViewOrder
}: PaymentResultActionsProps) => (
  <div className="grid grid-cols-1 sm:gri`d-cols-3 gap-4 pt-4">
    <Button className="h-14 rounded-2xl bg-success-600 hover:bg-success-700 text-white font-bold text-lg shadow-lg shadow-success-100 flex items-center justify-center gap-2 group">
      <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Tải hóa đơn
    </Button>
    <Button
      onClick={onViewOrder}
      variant="outline"
      className="h-14 rounded-2xl border-2 border-mint-200 bg-white text-mint-1100 hover:bg-mint-50 font-bold text-lg group"
    >
      <Receipt className="w-5 h-5 mr-2 opacity-60 group-hover:opacity-100" /> Chi tiết đơn hàng
    </Button>
    <Button
      onClick={onNavigateHome}
      variant="outline"
      className="h-14 rounded-2xl border-2 border-mint-200 bg-white text-mint-1100 hover:bg-mint-50 font-bold text-lg group"
    >
      <Home className="w-5 h-5 mr-2 opacity-60 group-hover:opacity-100" /> Về trang chủ
    </Button>
  </div>
)

export const PaymentFailureReasons = () => (
  <Card className="p-10 border-none shadow-xl rounded-3xl bg-white text-center space-y-6">
    <div className="bg-mint-50 p-6 rounded-2xl flex items-start gap-4 text-left">
      <AlertCircle className="w-6 h-6 text-danger-500 mt-1 flex-shrink-0" />
      <div className="space-y-2 text-mint-900">
        <p className="font-bold">Lý do có thể:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-mint-700/80">
          <li>Tài khoản không đủ số dư</li>
          <li>Hết thời gian chờ thanh toán</li>
          <li>Lỗi hệ thống từ ngân hàng</li>
          <li>Người dùng hủy giao dịch</li>
        </ul>
      </div>
    </div>
  </Card>
)

export const PaymentFooter = () => (
  <div className="text-center space-y-3 pt-4 pb-8">
    <p className="text-mint-800/60 font-medium">
      Bạn sẽ nhận được email xác nhận trong vài phút tới.
    </p>
    <p className="text-sm">
      Nếu có thắc mắc, vui lòng liên hệ{' '}
      <Link to="/support" className="text-primary-600 font-bold hover:underline">
        hỗ trợ khách hàng
      </Link>
      .
    </p>
  </div>
)
