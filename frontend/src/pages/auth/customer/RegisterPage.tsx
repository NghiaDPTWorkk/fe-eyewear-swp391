import { RegisterForm } from '@/components/layout/register-form/RegisterForm'
import { SIGN_UP_SVG_PATHS } from '@/shared/constants/svg-paths'
import signupPremium from '@/assets/images/signup-premium.png'
import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { CosmicBackground } from '@/components/layout/CosmicBackground'

export const RegisterPage = () => {
  return (
    <CosmicBackground>
      <div className="flex-1 overflow-y-auto p-4 lg:p-15">
        <div className="flex h-full min-h-fit items-center justify-center">
          <div className="grid w-full max-w-[1024px] grid-cols-1 overflow-hidden rounded-[32px] backdrop-blur-2xl lg:grid-cols-2">
            {/* Sign-Up Form */}
            <div className="animate-slide-in-right flex flex-col items-center justify-center bg-transparent p-8 lg:p-12">
              <div className="w-full max-w-[380px]">
                <div className="mb-10">
                  <h1 className="mb-2 text-[32px] font-bold tracking-[-1px] text-white">Sign Up</h1>
                  <p className="text-[15px] text-white/40">
                    Create your account to start your visionary journey.
                  </p>
                </div>

                <RegisterForm variant="dark" />
              </div>
            </div>

            {/* Right Side: Product Imagery */}
            <div className="animate-slide-in-left relative hidden flex-col items-start justify-center overflow-hidden bg-black/40 lg:flex">
              <div className="absolute inset-0 bg-[#ffffff] opacity-70 mix-blend-multiply">
                <img
                  src={signupPremium}
                  alt="Premium Eyewear"
                  className="animate-zoom-in-subtle h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Floating Element Icon */}
              <div className="absolute left-10 top-10 z-10 flex size-24 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
                <div className="h-[15px] w-[22px]">
                  <svg className="size-full" fill="none" viewBox="0 0 33 22.5">
                    <path d={SIGN_UP_SVG_PATHS.lens_container} fill="#4ad7b0" />
                  </svg>
                </div>
              </div>

              {/* Text Overlay */}
              <div className="relative z-10 flex h-full w-full flex-col justify-end p-12">
                <div className="mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#4ad7b0]">
                    The Atelier Series
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-[40px] font-extrabold leading-[1.1] tracking-[-1.5px] text-white">
                    Define Your
                    <br />
                    Vision.
                  </h2>
                </div>
                <div className="max-w-xs">
                  <p className="text-[14px] leading-[1.5] text-white/50">
                    Join our digital atelier and discover a curated collection designed for the
                    lucid visionary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black/40 px-12 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1024px] flex-col items-center justify-between gap-6 lg:flex-row lg:gap-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[18px] font-bold text-white">Eyewear Optic</h3>
            <p className="text-[12px] text-white/40">© 2026 Eyewear Optic. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[12px] font-medium text-white/60">
            <Link to={PATHS.POLICIES.PRIVACY} className="transition-colors hover:text-[#4ad7b0]">
              Privacy Policy
            </Link>
            <Link
              to={PATHS.POLICIES.ORDER_PAYMENT}
              className="transition-colors hover:text-[#4ad7b0]"
            >
              Terms of Service
            </Link>
            <Link to={PATHS.POLICIES.SHIPPING} className="transition-colors hover:text-[#4ad7b0]">
              Shipping
            </Link>
            <Link
              to={PATHS.POLICIES.RETURN_WARRANTY}
              className="transition-colors hover:text-[#4ad7b0]"
            >
              Returns
            </Link>
          </div>

          <div className="flex gap-4">
            <a
              href="https://eyewear-optic.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-[#4ad7b0]"
            >
              <svg
                className="size-[14px] transition-colors group-hover:fill-black"
                fill="none"
                viewBox="0 0 16.67 16.67"
              >
                <path d={SIGN_UP_SVG_PATHS.globe} fill="white" />
              </svg>
            </a>
            <a
              href="https://eyewear-optic.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-[#4ad7b0]"
            >
              <svg
                className="h-[14px] w-[13px] transition-colors group-hover:fill-black"
                fill="none"
                viewBox="0 0 15 16.67"
              >
                <path d={SIGN_UP_SVG_PATHS.share} fill="white" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </CosmicBackground>
  )
}
