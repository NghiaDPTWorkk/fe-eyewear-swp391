import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { VNDPrice } from '@/shared/components/ui/vnd-price/VNDPrice'
import { Button } from '@/shared/components/ui'

interface OrderSummarySectionProps {
  subtotal: number
  discount: number
  shipping: number
  total: number
  isProcessing: boolean
  onCheckout: () => void
}

export const OrderSummarySection = ({
  subtotal,
  discount,
  shipping,
  total,
  isProcessing,
  onCheckout
}: OrderSummarySectionProps) => {
  return (
    <>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold">
            <VNDPrice amount={subtotal} />
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-primary-600">
            <span className="font-medium">Discount</span>
            <span className="font-bold">
              -<VNDPrice amount={discount} />
            </span>
          </div>
        )}
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Shipping</span>
          <span className="font-bold">
            {shipping === 0 ? 'Free' : <VNDPrice amount={shipping} />}
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-mint-100">
          <span className="text-xl font-bold text-mint-1200 uppercase">
            Total{' '}
            <span className="text-xs font-medium text-gray-eyewear normal-case">(Excl. Tax)</span>
          </span>
          <span className="text-3xl font-extrabold text-mint-1200">
            <VNDPrice amount={total} />
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          isFullWidth
          size="lg"
          onClick={onCheckout}
          isLoading={isProcessing}
          className="py-6 rounded-xl shadow-sm hover:shadow-md uppercase tracking-wider font-bold bg-[#4AD7B0] hover:bg-[#3CBFA0] text-white border-0"
        >
          {isProcessing ? 'Processing...' : 'SECURE CHECKOUT'}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-[10px] text-gray-eyewear mb-4 leading-relaxed">
          By clicking on the button above you agree to our <br />
          <Link
            to="/policies/order-payment"
            className="underline hover:text-primary-500 transition-colors"
          >
            Order & Payment
          </Link>
          ,{' '}
          <Link
            to="/policies/shipping"
            className="underline hover:text-primary-500 transition-colors"
          >
            Shipping
          </Link>
          ,{' '}
          <Link
            to="/policies/return-warranty"
            className="underline hover:text-primary-500 transition-colors"
          >
            Returns
          </Link>{' '}
          and{' '}
          <Link
            to="/policies/privacy"
            className="underline hover:text-primary-500 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-mint-1200 font-bold">
          <Shield className="w-4 h-4 text-primary-500" />
          Secure checkout guaranteed
        </div>
      </div>
    </>
  )
}
