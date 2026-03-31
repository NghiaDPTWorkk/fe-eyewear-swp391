import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { LoginRequest } from '@/shared/types'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { getOrCreateDeviceId } from '@/shared/utils/device.utils'
import { ENDPOINTS } from '@/api/endpoints'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SIGN_IN_SVG_PATHS } from '@/shared/constants/svg-paths'
import { Checkbox } from '@/shared/components/ui/checkbox/Checkbox'

interface LoginFormProps {
  role?: string
  variant?: 'light' | 'dark'
}

const loginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
})

export const LoginForm = ({ role: _role, variant = 'light' }: LoginFormProps) => {
  const { mutate: login, isPending } = useLogin()
  const location = useLocation()
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isDark = variant === 'light'
  const labelColor = isDark ? 'text-[#00362d]' : 'text-[#4ad7b0]'
  const inputBg = isDark ? 'bg-white/5 border border-white/10' : 'bg-[#d7fff3]'
  const inputTextColor = isDark ? 'text-white' : 'text-[#00362d]'
  const placeholderColor = isDark ? 'placeholder:text-white/30' : 'placeholder:text-[#80b8aa]'
  const iconColor = isDark ? '#00684E' : '#4ad7b0'

  const formik = useFormik<LoginRequest>({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values)
    }
  })

  const handleGoogleLogin = () => {
    const deviceId = getOrCreateDeviceId()
    const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1`
    const googleAuthUrl = `${baseUrl}${ENDPOINTS.AUTH.GOOGLE}?state=${deviceId}`

    // Save intended redirect path if available
    const from = (location.state as any)?.from?.pathname || '/'
    if (from !== '/login' && from !== '/register') {
      localStorage.setItem('redirect_after_login', from)
    }

    window.location.href = googleAuthUrl
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex w-full flex-col gap-6">
      {/* Form Fields */}
      <div className="flex w-full flex-col gap-4">
        {/* Email Field */}
        <div className="flex w-full flex-col gap-2">
          <label className={`text-[12px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Email
          </label>
          <div className="relative">
            <div
              className={`rounded-[12px] ${inputBg} transition-all focus-within:ring-2 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-12 py-4">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  {...formik.getFieldProps('email')}
                  className={`w-full bg-transparent text-[16px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="size-[16.67px]" fill="none" viewBox="0 0 16.67 13.33">
                <path d={SIGN_IN_SVG_PATHS.email} fill={iconColor} />
              </svg>
            </div>
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="ml-1 mt-1 text-[11px] font-bold text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex w-full flex-col gap-2">
          <label className={`text-[12px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Password
          </label>
          <div className="relative">
            <div
              className={`rounded-[12px] ${inputBg} transition-all focus-within:ring-2 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-12 py-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...formik.getFieldProps('password')}
                  className={`w-full bg-transparent text-[16px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="size-[17.5px]" fill="none" viewBox="0 0 13.33 17.5">
                <path d={SIGN_IN_SVG_PATHS.password} fill={iconColor} />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100"
            >
              <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 22 15">
                <path d={SIGN_IN_SVG_PATHS.eye} fill={iconColor} />
              </svg>
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="ml-1 mt-1 text-[11px] font-bold text-red-500">{formik.errors.password}</p>
          )}
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <Checkbox
            isChecked={rememberMe}
            onCheckedChange={setRememberMe}
            label="Remember me"
            size="md"
            labelClassName={`text-[14px] font-medium ${isDark ? 'text-[#00362d]' : 'text-white/60'}`}
          />
          <a
            href="#"
            className={`text-[14px] font-bold ${isDark ? 'text-[#00362d]' : 'text-white/80'} hover:underline`}
          >
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pb-2">
        <button
          type="submit"
          disabled={isPending || !formik.isValid}
          className={`relative flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[10px] ${isDark ? 'bg-[#4ad7b0] text-black hover:bg-[#3bc7a0]' : 'bg-[#00684e] text-[#c6ffe6] hover:bg-[#005a42]'} text-base font-bold shadow-[0_10px_15px_-3px_rgba(0,104,78,0.15)] transition-all disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </button>

        {_role !== 'staff' && (
          <>
            <div className="relative flex items-center justify-center py-2">
              <div className={`h-px w-full ${isDark ? 'bg-[#ffffff]' : 'bg-[#ffffff]'}`}></div>
              <span
                className={`absolute ${isDark ? 'bg-[#001a16] text-[#ffffff]' : 'bg-[#ffffff] text-[#00362d]'} px-4 text-[12px] font-bold uppercase tracking-[1.2px]`}
              >
                Or
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`flex h-[50px] w-full items-center justify-center gap-3 rounded-[10px] border ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-[#00684e]/20 bg-white text-[#00362d] hover:bg-gray-50'} font-bold transition-all text-[14px]`}
            >
              <svg className="size-4" viewBox="0 0 20 20">
                <path d={SIGN_IN_SVG_PATHS.google_g} fill="#4285F4" />
                <path d={SIGN_IN_SVG_PATHS.google_green} fill="#34A853" />
                <path d={SIGN_IN_SVG_PATHS.google_yellow} fill="#FBBC05" />
                <path d={SIGN_IN_SVG_PATHS.google_red} fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <p className={`text-center text-[16px] ${isDark ? 'text-[#00362d]' : 'text-white/40'}`}>
              Don't have an account?{' '}
              <Link
                to="/register"
                state={{ from: (location.state as any)?.from }}
                className={`font-bold ${isDark ? 'text-[#00684e]' : 'text-[#4ad7b0]'} hover:underline`}
              >
                Sign Up
              </Link>
            </p>
          </>
        )}
      </div>

      {_role !== 'staff' && (
        <div
          className={`border-t ${isDark ? 'border-white/5' : 'border-gray-100'} pt-6 text-center`}
        >
          <span className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
            Are you a staff member?{' '}
          </span>
          <Link
            to="/admin/login"
            className={`text-xs font-semibold ${isDark ? 'text-gray-500 hover:text-[#00684e]' : 'text-white/40 hover:text-[#4ad7b0]'} transition-colors`}
          >
            Staff Portal
          </Link>
        </div>
      )}
    </form>
  )
}
