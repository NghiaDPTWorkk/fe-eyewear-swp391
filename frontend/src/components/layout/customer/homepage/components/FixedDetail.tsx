import React from 'react'
import { Link } from 'react-router-dom'

export const FixedDetail: React.FC = () => {
  return (
    <div className="w-full bg-mint-200">
      {/* Top Decoration Banner */}
      <div className="w-full bg-gradient-to-r from-[#eaf7f4] to-[#a3ddd0] py-3 text-center">
        <p className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-slate-700 uppercase">
          RAY-BAN & OAKLEY META AI GLASSES NOW WITH AN EXTRA 10% OFF LENSES
        </p>
      </div>

      {/* Main Content Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Premium Visual */}
          <div className="w-full lg:w-[40%] relative">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[600px]">
              <img
                src="/images/present/present2.png"
                alt="Premium Eyewear"
                className="w-full h-auto object-contain"
              />
              {/* Subtle Overlay for Premium Feel */}
              <div className="absolute inset-0 bg-gradient-to-tr from-mint-500/10 to-transparent pointer-events-none" />
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mint-200/50 rounded-full blur-3xl -z-10" />
          </div>

          {/* Right: Insurance Info */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-2xl md:text-5xl font-bold text-mint-800 mb-6 leading-[1.15]">
              Purchasing with insurance,
              <br className="hidden md:block" /> made easy.
            </h2>
            <p className="text-base text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              This is our promise to you. We accept most vision insurance plans, both in and
              out-of-network.
            </p>

            {/* Partner Logos Area */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-12 mb-14 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-xl font-black tracking-tighter text-slate-800">eyeMed</div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-800 rotate-45" />
                <span className="text-xs font-bold uppercase tracking-tight text-slate-700">
                  SuperiorVision™
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-slate-800 rounded-full" />
                </div>
                <span className="text-xs font-bold uppercase tracking-tight text-slate-700">
                  DavisVision™
                </span>
              </div>
              <div className="bg-slate-800 text-white px-2 py-1 text-[10px] font-bold rounded">
                NVA
              </div>
            </div>

            {/* Strategic Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/eyeglasses"
                className="w-full sm:w-auto px-10 py-4 bg-[#427b6f] hover:bg-[#5aab90] text-white font-bold rounded-lg uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg hover:shadow-[#5c649c]/30 transform hover:-translate-y-1"
              >
                SHOP WITH INSURANCE
              </Link>
              <Link
                to="/face-tutorial"
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
