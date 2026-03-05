import { CreditCard } from 'lucide-react'
import { PaymentMethodType } from '@/shared/types'

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethodType
  onPaymentMethodChange: (method: PaymentMethodType) => void
}

export const PaymentMethodSection = ({
  paymentMethod,
  onPaymentMethodChange
}: PaymentMethodSectionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary-500" />
        Payment Method
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onPaymentMethodChange(PaymentMethodType.COD)}
          className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
            paymentMethod === PaymentMethodType.COD
              ? 'border-primary-500 bg-primary-50 text-primary-600'
              : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
          }`}
        >
          COD
        </button>
        <button
          onClick={() => onPaymentMethodChange(PaymentMethodType.VNPAY)}
          className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
            paymentMethod === PaymentMethodType.VNPAY
              ? 'border-[#0056A2] bg-[#0056A2]/5 text-[#0056A2]'
              : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
          }`}
        >
          <img
            src="https://vnpay.vn/wp-content/uploads/2020/07/vnpay-logo.png"
            alt="VNPay"
            className="h-6"
          />
          <span className="font-bold text-sm">VNPay</span>
        </button>
        <button
          onClick={() => onPaymentMethodChange(PaymentMethodType.PAYOS)}
          className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
            paymentMethod === PaymentMethodType.PAYOS
              ? 'border-[#0066FF] bg-[#0066FF]/5 text-[#0066FF]'
              : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
          }`}
        >
          <img
            src="https://payos.vn/wp-content/uploads/2023/07/payos-logo.png"
            alt="PayOS"
            className="h-6"
          />
          <span className="font-bold text-sm">PayOS</span>
        </button>
      </div>
    </div>
  )
}
