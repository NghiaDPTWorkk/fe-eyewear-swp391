import { Suspense } from 'react'

interface LazyPageProps {
  children: React.ReactNode
}

export function LazyPage({ children }: LazyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center gap-6 select-none animate-in fade-in duration-500">
          <div className="relative">
            {/* Pulsing glow background */}
            <div className="absolute inset-0 bg-mint-400 rounded-2xl blur-xl opacity-20 animate-pulse" />

            {/* Branded Logo Square */}
            <div className="w-14 h-14 bg-mint-500 rounded-2xl flex items-center justify-center shadow-xl shadow-mint-200 relative z-10 animate-fade-in duration-700">
              <span className="text-white font-bold text-2xl leading-none">O</span>
            </div>

            {/* Modern orbital spinner around logo */}
            <div className="absolute -inset-3 border-[3px] border-mint-100 border-t-mint-500 rounded-[22px] animate-spin duration-[2s]" />
            <div className="absolute -inset-3 border-[3px] border-transparent border-b-mint-300/30 rounded-[22px] animate-spin-reverse duration-[3s]" />
          </div>

          <div className="flex flex-col items-center gap-2 mt-2">
            <h3 className="text-[11px] font-black text-slate-800 tracking-[0.4em] uppercase pl-[0.4em]">
              OpticView
            </h3>
            <div className="flex items-center gap-1.5 opacity-40">
              <span className="w-1 h-1 bg-mint-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1 h-1 bg-mint-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1 h-1 bg-mint-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
