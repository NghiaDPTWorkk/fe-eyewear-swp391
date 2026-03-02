import { Truck, RotateCcw, Glasses, Headphones } from 'lucide-react'

export const BenefitsBar = () => {
  return (
    <section className="bg-white border-y border-mint-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-mint-1200 text-sm">Free Delivery</h3>
              <p className="text-xs text-gray-eyewear">Đơn hàng trên 500.000đ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-mint-1200 text-sm">30-Day Returns</h3>
              <p className="text-xs text-gray-eyewear">Hassle-free returns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Glasses className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-mint-1200 text-sm">Virtual Try-On</h3>
              <p className="text-xs text-gray-eyewear">Try before you buy</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-mint-1200 text-sm">24/7 Support</h3>
              <p className="text-xs text-gray-eyewear">Expert assistance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
