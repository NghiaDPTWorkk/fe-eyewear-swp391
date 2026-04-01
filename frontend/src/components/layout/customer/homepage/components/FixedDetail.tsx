import React from 'react'
import { Link } from 'react-router-dom'

export const FixedDetail: React.FC = () => {
  return (
    <div className="w-full bg-mint-200">
      {/* Top Decoration Banner */}
      <div className="w-full bg-gradient-to-r from-[#eaf7f4] to-[#a3ddd0] py-10 text-center">
        <p className="px-6 text-sm sm:text-lg md:text-xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-slate-700 uppercase leading-relaxed">
          RAY-BAN & OAKLEY META AI GLASSES NOW WITH AN EXTRA 10% OFF LENSES
        </p>
      </div>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Premium Visual */}
          <div className="w-full lg:w-[45%] relative">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[400px] md:max-h-[600px] bg-white">
              <img
                src="/images/present/present2.png"
                alt="Premium Eyewear"
                className="w-full h-full object-cover"
              />
              {/* Subtle Overlay for Premium Feel */}
              <div className="absolute inset-0 bg-gradient-to-tr from-mint-500/10 to-transparent pointer-events-none" />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mint-200/50 rounded-full blur-3xl -z-10" />
          </div>

          {/* Right: Insurance Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-mint-800 mb-6 leading-[1.1] md:leading-[1.15]">
              Purchasing with insurance,
              <br className="hidden md:block" /> made easy.
            </h2>
            <p className="text-base text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              This is our promise to you. We accept most vision insurance plans, both in and
              out-of-network.
            </p>

            {/* Partner Logos Area - Refined for Luxury Feel */}
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-8 md:gap-10 mb-14 transition-all duration-700">
              {/* EyeMed - Elegant Serif style */}
              <div className="flex items-center gap-1 group">
                <span className="text-2xl font-serif italic font-bold tracking-tight text-mint-900 group-hover:text-mint-700 transition-colors">
                  eyeMed
                </span>
                <span className="w-1.5 h-1.5 bg-mint-400 rounded-full animate-pulse self-end mb-1.5" />
              </div>

              {/* SuperiorVision - Abstract Diamond Icon */}
              <div className="flex items-center gap-3 group">
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-800 rotate-45 transform group-hover:rotate-[135deg] transition-transform duration-700 rounded-sm" />
                  <div className="absolute inset-0.5 bg-white rotate-45 rounded-sm" />
                  <div className="w-2 h-2 bg-slate-800 rotate-45" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 leading-none">
                    Superior
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 leading-tight">
                    Vision™
                  </span>
                </div>
              </div>

              {/* DavisVision - Minimalist Lens Icon */}
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                  <div className="w-3.5 h-3.5 border border-slate-300 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-mint-400 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 leading-none">
                    Davis
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 leading-tight">
                    Vision™
                  </span>
                </div>
              </div>

              {/* NVA - Clean Text Badge */}
              <div className="relative group overflow-hidden px-4 py-2 border-2 border-slate-800 rounded-sm hover:bg-slate-800 transition-colors duration-500">
                <span className="text-sm font-black tracking-[0.15em] text-slate-800 group-hover:text-white transition-colors">
                  NVA
                </span>
                <div className="absolute top-0 right-0 w-3 h-3 bg-mint-400 translate-x-1/2 -translate-y-1/2 rotate-45" />
              </div>
            </div>

            {/* Strategic Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/eyeglasses"
                onClick={() => window.scrollTo(0, 0)}
                className="w-full sm:w-auto px-10 py-4 bg-[#427b6f] hover:bg-[#5aab90] text-white font-bold rounded-lg uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg hover:shadow-[#62b0a9]/30 transform hover:-translate-y-1"
              >
                SHOP WITH INSURANCE
              </Link>
              <Link
                to="/face-tutorial"
                onClick={() => window.scrollTo(0, 0)}
                className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-200 hover:border-slate-800 text-slate-800 font-bold rounded-lg uppercase tracking-widest text-[11px] transition-all duration-300"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FixedDetail
