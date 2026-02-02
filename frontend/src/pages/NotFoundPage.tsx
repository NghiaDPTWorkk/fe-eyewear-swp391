import { useNavigate } from 'react-router-dom'
import { Button } from '@/components'
import { IoGlassesOutline, IoHomeOutline, IoArrowBack } from 'react-icons/io5'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 relative overflow-hidden Selection:bg-emerald-100 Selection:text-emerald-900">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-50/50 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-lg w-full px-6 text-center">
        {/* Animated Icon Container */}
        <div className="mb-8 relative inline-flex items-center justify-center">
          <div className="relative z-10 animate-bounce-slow">
            <IoGlassesOutline className="text-[120px] text-emerald-500 drop-shadow-2xl opacity-90" />
          </div>
          {/* Decorative rings behind icon */}
          <div className="absolute inset-0 bg-white rounded-full shadow-lg opacity-40 scale-150 animate-ping-slow" />
          <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 opacity-20 blur-xl" />

          {/* Question marks floating */}
          <span className="absolute -top-4 -right-8 text-4xl text-emerald-400 font-bold animate-float delay-100">
            ?
          </span>
          <span className="absolute -bottom-2 -left-6 text-2xl text-emerald-300 font-bold animate-float delay-300">
            ?
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-8xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-700 tracking-tight">
            Looks like you're lost
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            We couldn't find the page you were looking for. It might have been moved, deleted, or
            you may have typed the URL incorrectly.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="outline"
            className="w-full sm:w-auto min-w-[140px] h-12 rounded-xl font-semibold border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow group"
            onClick={() => navigate(-1)}
          >
            <IoArrowBack className="mr-2 text-lg group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>

          <Button
            variant="solid"
            className="w-full sm:w-auto min-w-[140px] h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all group border-none"
            onClick={() => navigate('/')}
          >
            <IoHomeOutline className="mr-2 text-lg group-hover:scale-110 transition-transform" />
            Back to Home
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-12 text-sm text-slate-400 font-medium">
          Need help?{' '}
          <a href="/contact" className="text-emerald-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>

      {/* Custom Animations Styles */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-10px) rotate(5deg); opacity: 0.5; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}
