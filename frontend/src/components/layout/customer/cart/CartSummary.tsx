import { Truck, Shield } from 'lucide-react'
import { useState } from 'react'
import { Button, Card } from '@/shared/components/ui'

interface CartSummaryProps {
  subtotal: number
}

export const CartSummary = ({ subtotal }: CartSummaryProps) => {
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')
  const [applyInsurance, setApplyInsurance] = useState(false)

  const shipping = shippingMethod === 'express' ? 18 : 0
  const total = subtotal + shipping

  return (
    <Card className="p-8 border-mint-300/50 sticky top-8 rounded-3xl">
      <h2 className="text-xl font-bold text-mint-1200 mb-6">Select a shipping method</h2>

      <div className="space-y-4 mb-8">
        <label
          onClick={() => setShippingMethod('standard')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            shippingMethod === 'standard'
              ? 'border-primary-500 bg-primary-50/30'
              : 'border-mint-200 hover:border-primary-300'
          }`}
        >
          <div
            className={`mt-1 w-5 h-5 rounded-full border-4 flex-shrink-0 transition-all ${
              shippingMethod === 'standard' ? 'border-primary-500' : 'border-mint-300'
            }`}
          ></div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="flex items-center gap-2 font-bold text-mint-1200 text-sm">
                <Truck className="w-4 h-4 text-primary-500" />
                Responsible shipping
              </span>
              <span className="text-sm font-bold text-primary-600">Free</span>
            </div>
            <p className="text-xs text-gray-eyewear uppercase font-bold tracking-tight">
              Est. Date Jan 28 - Jan 30
            </p>
          </div>
        </label>

        <label
          onClick={() => setShippingMethod('express')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
            shippingMethod === 'express'
              ? 'border-primary-500 bg-primary-50/30'
              : 'border-mint-200 hover:border-primary-300'
          }`}
        >
          <div
            className={`mt-1 w-5 h-5 rounded-full border-4 flex-shrink-0 transition-all ${
              shippingMethod === 'express' ? 'border-primary-500' : 'border-mint-300'
            }`}
          ></div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-mint-1200 text-sm">Express delivery</span>
              <span className="text-sm font-bold text-mint-1200">$18.00</span>
            </div>
            <p className="text-xs text-gray-eyewear uppercase font-bold tracking-tight">
              Est. Date Jan 29 - Jan 31
            </p>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between py-6 border-t border-mint-100 mb-6">
        <span className="text-mint-1200 font-bold">Apply insurance benefits</span>
        <div
          onClick={() => setApplyInsurance(!applyInsurance)}
          className={`w-12 h-6 rounded-full relative cursor-pointer p-1 transition-colors ${
            applyInsurance ? 'bg-primary-500' : 'bg-mint-300'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-all transform ${
              applyInsurance ? 'translate-x-6' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold">
            ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-mint-1200">
          <span className="font-medium">Shipping</span>
          <span className="font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between items-baseline pt-4 border-t border-mint-100">
          <span className="text-xl font-bold text-mint-1200 uppercase">
            Total{' '}
            <span className="text-xs font-medium text-gray-eyewear normal-case">(Excl. Tax)</span>
          </span>
          <span className="text-3xl font-extrabold text-mint-1200">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <Button
          isFullWidth
          size="lg"
          className="py-6 rounded-lg shadow-sm hover:shadow-md uppercase tracking-wider font-bold bg-[#4AD7B0] hover:bg-[#3CBFA0] text-white border-0"
        >
          SECURE CHECKOUT
        </Button>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative px-4 bg-white text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            or express checkout with
          </span>
        </div>

        <Button className="w-full py-4 border border-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PayPal"
            className="h-6"
          />
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-eyewear mb-6">
          By clicking on one of the Buttons above you agree to Glasses.com <br />
          <a href="#" className="underline hover:text-primary-500">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-mint-1200 font-bold">
          <Shield className="w-4 h-4 text-primary-500" />
          We accept FSA/HSA cards for payments
        </div>
      </div>
    </Card>
  )
}
