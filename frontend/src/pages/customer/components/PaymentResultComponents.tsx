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
            <CheckCircle2 className="w-16 h-16" stroke="#1a6d53" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Payment successful!</h1>
          <p className="text-lg text-mint-800/70 font-medium">
            Your order has been confirmed and is being processed
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
        <h1 className="text-4xl font-black text-danger-600">Payment failed</h1>
        <p className="text-lg text-mint-800/70 font-medium">
          {error || 'Transaction failed or has been cancelled.'}
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
        Total amount paid
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
      <h2 className="text-xl font-bold">Transaction Information</h2>
    </div>
    <div className="grid gap-5 text-base">
      <div className="flex justify-between items-center group">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <Hash className="w-4 h-4" /> Transaction ID
        </div>
        <span className="font-bold text-mint-1100 bg-mint-50 px-3 py-1 rounded-lg">
          TXN-{transactionNo || 'N/A'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <Calendar className="w-4 h-4" /> Payment Date
        </div>
        <span className="font-semibold text-mint-1000">{formattedDate}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-mint-800/60 font-medium">
          <CreditCard className="w-4 h-4" /> Payment Method
        </div>
        <span className="font-semibold text-mint-1000">ATM Card / Bank Account</span>
      </div>
    </div>
  </Card>
)

interface OrderInvoiceDetailsProps {
  invoiceData: InvoiceDetailData | null
}

export const OrderInvoiceDetails = ({ invoiceData }: OrderInvoiceDetailsProps) => (
  <Card className="p-8 border-none shadow-xl rounded-3xl bg-white space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-mint-50">
      <div className="bg-mint-100 p-2 rounded-xl text-mint-700">
        <ShoppingBag className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold">Order Details</h2>
    </div>

    <div className="space-y-6">
      {invoiceData?.productList.map((item, idx) => {
        const product = item.product
        const lens = item.lens
        const quantity = item.quantity || 1
        const mainItem = product || lens

        if (!mainItem) return null

        const itemTotal = ((product?.pricePerUnit || 0) + (lens?.pricePerUnit || 0)) * quantity

        return (
          <div key={idx} className="flex gap-4 group">
            <div className="w-16 h-16 rounded-xl bg-mint-50 p-2 flex-shrink-0 border border-mint-100/50">
              <img
                src={mainItem.detail.imgs[0]}
                alt={mainItem.detail.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-bold text-mint-1100 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2">
                    {mainItem.detail.name}
                  </p>
                  {product && lens && (
                    <p className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">
                      + Includes Lenses
                    </p>
                  )}
                  <p className="text-xs text-mint-800/60 font-medium">
                    Quantity: <span className="text-mint-1000 font-bold">x{quantity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-mint-1100">
                    <VNDPrice amount={itemTotal} />
                  </div>
                  {quantity > 1 && (
                    <p className="text-[10px] text-mint-800/40 font-medium">
                      <VNDPrice amount={itemTotal / quantity} /> / item
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>

    <div className="pt-8 border-t border-dashed border-mint-200 space-y-4">
      <div className="flex justify-between text-mint-800/70 font-medium">
        <span>Subtotal</span>
        <VNDPrice
          amount={
            (invoiceData?.invoice.totalPrice || 0) + (invoiceData?.invoice.totalDiscount || 0)
          }
        />
      </div>
      {invoiceData?.invoice.totalDiscount && invoiceData.invoice.totalDiscount > 0 ? (
        <div className="flex justify-between text-mint-800/70 font-medium">
          <span>Discount</span>
          <span className="text-danger-500 font-bold">
            -<VNDPrice amount={invoiceData.invoice.totalDiscount} />
          </span>
        </div>
      ) : null}
      <div className="flex justify-between text-mint-800/70 font-medium">
        <span>Shipping Fee</span>
        <span className="text-success-600 font-bold">Free</span>
      </div>
      <div className="flex justify-between text-2xl font-black text-mint-1200 pt-4">
        <span>Total</span>
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
      <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Download
      Invoice
    </Button>
    <Button
      onClick={onViewOrder}
      variant="outline"
      className="h-14 rounded-2xl border-2 border-mint-200 bg-white text-mint-1100 hover:bg-mint-50 font-bold text-lg group"
    >
      <Receipt className="w-5 h-5 mr-2 opacity-60 group-hover:opacity-100" /> Order Details
    </Button>
    <Button
      onClick={onNavigateHome}
      variant="outline"
      className="h-14 rounded-2xl border-2 border-mint-200 bg-white text-mint-1100 hover:bg-mint-50 font-bold text-lg group"
    >
      <Home className="w-5 h-5 mr-2 opacity-60 group-hover:opacity-100" /> Back to Home
    </Button>
  </div>
)

export const PaymentFailureReasons = () => (
  <Card className="p-10 border-none shadow-xl rounded-3xl bg-white text-center space-y-6">
    <div className="bg-mint-50 p-6 rounded-2xl flex items-start gap-4 text-left">
      <AlertCircle className="w-6 h-6 text-danger-500 mt-1 flex-shrink-0" />
      <div className="space-y-2 text-mint-900">
        <p className="font-bold">Possible reasons:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-mint-700/80">
          <li>Insufficient account balance</li>
          <li>Payment timeout</li>
          <li>Bank system error</li>
          <li>User cancelled transaction</li>
        </ul>
      </div>
    </div>
  </Card>
)

export const PaymentFooter = () => (
  <div className="text-center space-y-3 pt-4 pb-8">
    <p className="text-mint-800/60 font-medium">You will receive a confirmation email shortly.</p>
    <p className="text-sm">
      If you have any questions, please contact{' '}
      <Link to="/support" className="text-primary-600 font-bold hover:underline">
        customer support
      </Link>
      .
    </p>
  </div>
)
