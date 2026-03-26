import { Glasses, FilePlus, ShoppingCart, Layers, MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const BuySteps = () => {
  const steps = [
    {
      icon: <Glasses className="w-8 h-8" />,
      text: "Choose the frame you've had your eye on"
    },
    {
      icon: <FilePlus className="w-8 h-8" />,
      text: "Add your prescription and we'll recommend the most suitable lens for your vision need"
    },
    {
      icon: <Layers className="w-8 h-8" />,
      text: 'Choose the lens brand and thickness, then tailor it to your eyes with any treatments you want'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      text: 'Place your order and enjoy expert support every step of the way'
    }
  ]

  return (
    <section className="pt-8 pb-16 bg-mint-200">
      <div className="container mx-auto px-4">
        {/* Steps Section */}
        <div className="text-center pt-8 mb-12">
          <h2 className="text-3xl font-bold text-mint-1200 mb-16">
            Buy prescription glasses in a few easy steps
          </h2>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-10 left-[10%] right-[10%] h-[1.5px] bg-mint-300 hidden lg:block z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-8">
                  <div className="w-20 h-20 bg-white border-2 border-mint-200 rounded-2xl flex items-center justify-center text-mint-900 shadow-sm transition-colors group">
                    {step.icon}
                  </div>
                  <p className="text-sm text-mint-800 leading-relaxed font-semibold px-4">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-16">
          <Link
            to="/eyeglasses"
            className="group relative px-10 py-4 bg-mint-1200 text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              SHOP EYEGLASSES
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            to="/sunglasses"
            className="group relative px-10 py-4 bg-mint-1200 text-white font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              SHOP SUNGLASSES
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
