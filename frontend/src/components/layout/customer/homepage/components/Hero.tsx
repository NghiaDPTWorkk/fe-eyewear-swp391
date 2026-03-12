import glasses_blue from '@/assets/images/glasses_blue.avif'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative bg-gradient-to-br from-mint-300 via-mint-200 to-primary-100 overflow-hidden">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <div className="inline-block px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-medium">
              NEW YEAR SALE - SAVE 30%
            </div>
            <h1 className="text-5xl lg:text-6xl font-heading font-bold text-mint-1200 leading-tight">
              Discover Our New Collection
            </h1>
            <p className="text-lg text-gray-eyewear leading-relaxed">
              Premium eyewear designed for style and comfort. Find your perfect frame from our
              curated collection of modern designs.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/eyeglasses')}
                className="px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Shop Now
              </button>
              <button className="px-8 py-4 bg-white text-mint-1200 font-semibold rounded-xl hover:bg-mint-300 transition-all duration-300 border-2 border-mint-300">
                Try Virtual Try-On
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700 rounded-3xl transform rotate-6 opacity-20"></div>
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-mint-200 to-mint-300 rounded-2xl flex items-center justify-center">
                <img
                  src={glasses_blue}
                  alt="Premium Blue Glasses"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
