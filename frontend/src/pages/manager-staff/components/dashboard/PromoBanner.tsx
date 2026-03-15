import React from 'react'

export const PromoBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-mint-500 via-mint-600 to-mint-700 p-8 rounded-3xl text-white shadow-[0_15px_35px_rgba(59,193,157,0.2)] h-full flex flex-col justify-end min-h-[200px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-24 -mt-24" />
      <div className="absolute top-1/2 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-20" />

      <div className="relative z-10">
        <h2 className="text-2xl font-semibold font-heading mb-3 tracking-tight">
          Increase your sales
        </h2>
        <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium max-w-[220px]">
          Discover the Proven Methods to Skyrocket Your Sales and Achieve Growth.
        </p>
        <button className="bg-white text-mint-600 px-6 py-2.5 rounded-xl text-[13px] font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95">
          Learn More
        </button>
      </div>

      <div className="absolute top-6 right-6 text-white/20 scale-150 transform rotate-12">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" />
        </svg>
      </div>
    </div>
  )
}
