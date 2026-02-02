import { Suspense } from 'react'
import { IoGlassesOutline } from 'react-icons/io5'

interface LazyPageProps {
  children: React.ReactNode
}

export function LazyPage({ children }: LazyPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
          {/* Icon with rings */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50 animate-ping-slow" />
            <div className="relative bg-white w-16 h-16 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center z-10">
              <IoGlassesOutline className="text-3xl text-emerald-500 animate-pulse" />
            </div>
            {/* Rotating border effect */}
            <div className="absolute inset-[-4px] rounded-2xl border border-emerald-500/10 animate-spin-slow" />
          </div>

          {/* Text */}
          <div className="space-y-2 text-center">
            <h3 className="text-sm font-semibold text-gray-900 tracking-widest uppercase">
              Loading
            </h3>
            <div className="flex gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
            </div>
          </div>

          <style>{`
            .animate-ping-slow {
              animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            .animate-spin-slow {
              animation: spin 8s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
