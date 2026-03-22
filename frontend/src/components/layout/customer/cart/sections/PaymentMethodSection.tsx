import { PaymentMethodType } from '@/shared/utils/enums/payment.enum'
import { CreditCard } from 'lucide-react'

interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethodType
  onPaymentMethodChange: (method: PaymentMethodType) => void
  hideCOD?: boolean
}

export const PaymentMethodSection = ({
  paymentMethod,
  onPaymentMethodChange,
  hideCOD
}: PaymentMethodSectionProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-mint-1200 mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary-500" />
        Payment Method
      </h2>
      <div className="space-y-3">
        {/* Online Payment Methods Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onPaymentMethodChange(PaymentMethodType.VNPAY)}
            className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              paymentMethod === PaymentMethodType.VNPAY
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
            }`}
          >
            <img
              src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
              alt="VNPay"
              className="h-6"
            />
            <span className="font-bold text-sm">VNPay</span>
          </button>
          <button
            onClick={() => onPaymentMethodChange(PaymentMethodType.PAYOS)}
            className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
              paymentMethod === PaymentMethodType.PAYOS
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
            }`}
          >
            <img
              src="https://payos.vn/wp-content/uploads/2025/06/Casso-payOSLogo-1.svg"
              alt="PayOS"
              className="h-8"
            />
            <span className="font-bold text-sm">PayOS</span>
          </button>
        </div>

        {/* COD Row */}
        {!hideCOD && (
          <button
            onClick={() => onPaymentMethodChange(PaymentMethodType.COD)}
            className={`w-full py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
              paymentMethod === PaymentMethodType.COD
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : 'border-mint-200 text-gray-eyewear hover:border-mint-300'
            }`}
          >
            Cash on Delivery (COD)
          </button>
        )}
      </div>
    </div>
  )
}
