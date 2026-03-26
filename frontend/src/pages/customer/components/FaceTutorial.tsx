import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const FaceTutorial: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Header Section */}
      <div className="bg-mint-200 py-5 md:py-10 border-b border-mint-300">
        <div className="container mx-auto px-2 max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Find Your Perfect Match:<br />
            <span className="text-mint-800 underline decoration-mint-400 decoration-4 underline-offset-8">A Guide to Face Shapes</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
            Selecting the right eyewear is an art. Discover how to identify your face shape and choose the frames that highlight your best features.
          </p>
        </div>
      </div>

      {/* Main Tutorial Content */}
      <div className="py-12 md:py-20 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Image Section (Smaller) */}
          <div className="w-full lg:w-5/12">
            <div className="bg-mint-200 rounded-[3rem] p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="mb-8 text-center w-full">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Visualizing Your Shape</h2>
                <p className="text-slate-500 font-medium italic text-[10px] md:text-xs">
                  * This guide is for reference purposes only.
                </p>
              </div>

              <div className="w-full relative group">
                <div className="overflow-hidden rounded-2xl shadow-lg bg-white p-4">
                  <img
                    src="/images/present/tutorialfaceshape.png"
                    alt="Face Shape Guide"
                    className="w-full h-auto object-contain mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Guidance Stacking */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            <div className="p-8 bg-mint-50/50 rounded-3xl border border-mint-100/50 transition-all hover:bg-mint-50">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-mint-200">
                  <span className="text-xl font-bold text-[#427b6f]">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Contrast is Key</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    The frame shape should provide a distinct contrast to your face shape. For instance, if you have a softer, round face, angular and geometric frames will add structure and definition.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-mint-50/50 rounded-3xl border border-mint-100/50 transition-all hover:bg-mint-50">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-mint-200">
                  <span className="text-xl font-bold text-[#427b6f]">02</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Scale & Balance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    The scale of your frames should be proportionate to the size of your facial features. Ensure the frames don&apos;t overwhelm small features or look too diminutive on larger profiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-mint-50/50 rounded-3xl border border-mint-100/50 transition-all hover:bg-mint-50">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 border border-mint-200">
                  <span className="text-xl font-bold text-[#427b6f]">03</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Color Harmony</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Choose a frame color that complements your skin undertones (warm or cool) and eye color. The right shade can brighten your appearance and complete your professional look.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Call to Action - Light Mint Theme */}
      <div className="bg-mint-200 py-20 text-center border-t border-mint-300">
        <h2 className="text-3xl font-bold text-mint-900 mb-8">Ready to find your frames?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/eyeglasses"
            onClick={() => window.scrollTo(0, 0)}
            className="px-10 py-4 bg-[#427b6f] hover:bg-[#5aab90] text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg"
          >
            Shop Eyeglasses
          </Link>
          <Link
            to="/sunglasses"
            onClick={() => window.scrollTo(0, 0)}
            className="px-10 py-4 bg-white border-2 border-mint-600/30 hover:border-mint-600 text-mint-800 font-bold rounded-xl uppercase tracking-widest text-xs transition-all"
          >
            Shop Sunglasses
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FaceTutorial
