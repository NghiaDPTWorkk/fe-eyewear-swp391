import { LoginForm } from '@/components/layout/login-form'
import { SIGN_IN_SVG_PATHS } from '@/shared/constants/svg-paths'
import signinPremium from '@/assets/images/signin-premium.png'
import { Link } from 'react-router-dom'

export const CustomerLoginPage = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-mint-300">
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex h-full min-h-fit items-center justify-center">
          <div className="grid w-full max-w-[1024px] grid-cols-1 overflow-hidden rounded-[12px] bg-white shadow-[0_20px_40px_0_rgba(0,54,45,0.06)] lg:grid-cols-2">
            {/* Left Side: Product Imagery (Slides in from Right across to Left) */}
            <div className="animate-slide-in-right relative hidden flex-col items-start justify-center bg-[#00362d] lg:flex">
              <div className="absolute inset-0 bg-[#00362d] opacity-30 mix-blend-multiply" />
              <div className="absolute inset-0 mix-blend-overlay">
                <img
                  src={signinPremium}
                  alt="Premium Eyewear"
                  className="animate-zoom-in-subtle h-full w-full object-cover"
                />
              </div>

              {/* Lens Filter Element */}
              <div className="absolute left-8 top-8 flex size-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                <div className="h-[15px] w-[22px]">
                  <svg className="size-full" fill="none" viewBox="0 0 33 22.5">
                    <path d={SIGN_IN_SVG_PATHS.lens_container} fill="#C6FFE6" />
                  </svg>
                </div>
              </div>

              {/* Text Overlay */}
              <div className="relative z-10 flex h-full w-full flex-col justify-end bg-gradient-to-t from-[#00362d]/15 to-transparent p-12">
                <div className="mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#c6ffe6]">
                    The Atelier Series
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-[36px] font-extrabold leading-[1.1] tracking-[-1.5px] text-[#c6ffe6]">
                    See the world
                    <br />
                    through a
                    <br />
                    finer lens.
                  </h2>
                </div>
                <div className="max-w-xs">
                  <p className="text-[14px] leading-[1.5] text-[#c6ffe6]/80">
                    Precision-crafted eyewear designed for the visionary. Sign in to access your
                    curated collection.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Sign-In Form (Slides in from Left across to Right) */}
            <div className="animate-slide-in-left flex flex-col items-center justify-center p-4 lg:p-8">
              <div className="w-full max-w-[380px]">
                <div className="mb-4">
                  <h1 className="mb-0.5 text-[28px] font-bold tracking-[-0.9px] text-[#00362d]">
                    Sign In
                  </h1>
                  <p className="text-[14px] text-[#00362d]">
                    Welcome back. Enter your details to continue.
                  </p>
                </div>

                <LoginForm role="customer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#d7fff3] px-12 py-6">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center justify-between gap-4 border-t border-[#00684e]/10 pt-4 lg:flex-row lg:gap-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[18px] font-bold text-[#00362d]">Eyewear Atelier</h3>
            <p className="text-[12px] text-[#00362d]/60">
              © 2024 Eyewear Atelier. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[12px] font-medium text-[#00362d]">
            <Link to="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:underline">
              Terms of Service
            </Link>
            <Link to="#" className="hover:underline">
              Shipping / Returns
            </Link>
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-full bg-[#b0f6e4] transition-colors hover:bg-[#a0e6d4]"
            >
              <svg className="size-[14px]" fill="none" viewBox="0 0 16.67 16.67">
                <path d={SIGN_IN_SVG_PATHS.facebook} fill="#00362D" />
              </svg>
            </a>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-full bg-[#b0f6e4] transition-colors hover:bg-[#a0e6d4]"
            >
              <svg className="h-[14px] w-[13px]" fill="none" viewBox="0 0 15 16.67">
                <path d={SIGN_IN_SVG_PATHS.share} fill="#00362D" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
