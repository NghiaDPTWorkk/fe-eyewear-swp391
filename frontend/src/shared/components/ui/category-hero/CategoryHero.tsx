import { ArrowRight } from 'lucide-react'

interface CategoryHeroProps {
  categoryName: string
  subtitle: string
  description: string
  image: string
  onShopClick?: () => void
}

export const CategoryHero = ({
  categoryName,
  subtitle,
  description,
  image,
  onShopClick
}: CategoryHeroProps) => {
  return (
    <div className="relative w-full bg-[#f8fcfb] rounded-[32px] overflow-hidden mb-12 border border-mint-200">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-400/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-10 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-primary-600 font-bold tracking-[0.3em] uppercase text-[10px]">
                <span className="w-6 h-[2px] bg-primary-500" />
                {categoryName}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-mint-1200 tracking-tighter leading-tight">
                {subtitle}
              </h1>
            </div>

            <p className="text-base text-gray-eyewear leading-relaxed max-w-md font-medium">
              {description}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={onShopClick}
                className="px-8 py-3.5 bg-mint-1200 text-white text-sm font-bold rounded-full hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 group"
              >
                SHOP COLLECTION
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative group animate-fade-in-up delay-150 flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl scale-75 group-hover:scale-100 transition-transform duration-1000 max-w-sm mx-auto" />
            <img
              src={image}
              alt={categoryName}
              className="relative z-10 w-full max-w-[350px] h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
