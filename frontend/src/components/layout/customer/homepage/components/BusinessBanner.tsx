import { ArrowRight, Glasses } from 'lucide-react'
import { Button } from '@/components'

export const BusinessBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-mint-300 to-primary-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-heading font-bold text-mint-1200">Beautify Your Space</h2>
            <p className="text-gray-eyewear leading-relaxed">
              Discover eyewear that complements your lifestyle. Our collection features premium
              materials, expert craftsmanship, and timeless designs that elevate your everyday look.
            </p>
            <Button className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 inline-flex items-center gap-2">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="aspect-square bg-gradient-to-br from-rose-200 to-rose-300 rounded-xl flex items-center justify-center">
                <Glasses className="w-20 h-20 text-rose-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg mt-8">
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                <Glasses className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
