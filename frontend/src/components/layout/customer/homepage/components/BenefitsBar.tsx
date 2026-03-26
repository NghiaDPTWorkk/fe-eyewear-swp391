import { Truck, RotateCcw, Glasses, Headphones } from 'lucide-react'

export const BenefitsBar = () => {
  return (
    <section className="bg-white py-10 relative">
      {/* Subtle Mint Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[300px] bg-primary-50/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Benefit Item Template */}
          {[
            { Icon: Truck, title: 'Free Delivery', desc: 'Orders over 500.000đ' },
            { Icon: RotateCcw, title: '3-Day Returns', desc: 'Hassle-free returns' },
            { Icon: Glasses, title: 'Virtual Try-On', desc: 'Try before you buy' },
            { Icon: Headphones, title: '24/7 Support', desc: 'Expert assistance' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-5 group">
              <div className="relative">
                {/* Decorative blob shape behind icon */}
                <div className="absolute inset-0 bg-primary-100 rounded-[2rem] rotate-45 scale-75 group-hover:rotate-90 group-hover:scale-100 transition-all duration-700 ease-in-out opacity-40" />
                <div className="w-14 h-14 bg-white border border-primary-50 rounded-2xl flex items-center justify-center relative z-10 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-500">
                  <item.Icon className="w-7 h-7 text-primary-500 group-hover:text-primary-600 transition-colors duration-500" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-[13px] uppercase tracking-[0.1em] group-hover:text-primary-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <div className="h-[2px] w-4 bg-primary-200 mx-auto group-hover:w-8 transition-all duration-500" />
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.05em] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
