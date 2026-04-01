import { useState, useRef } from 'react'
import { authService } from '@/features/auth/services/auth.service'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SIGN_IN_SVG_PATHS } from '@/shared/constants/svg-paths'

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
  variant?: 'light' | 'dark'
}

type ForgotPasswordStep = 'EMAIL' | 'OTP' | 'RESET'

export const ForgotPasswordForm = ({
  onBackToLogin,
  variant = 'light'
}: ForgotPasswordFormProps) => {
  const [step, setStep] = useState<ForgotPasswordStep>('EMAIL')
  const [email, setEmail] = useState('')
  const [otpArr, setOtpArr] = useState(['', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [resetToken, setResetToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isDark = variant === 'light'
  const textColor = isDark ? 'text-[#00362d]' : 'text-white'
  const labelColor = isDark ? 'text-[#00362d]' : 'text-[#4ad7b0]'
  const inputBg = isDark ? 'bg-white/5 border border-white/10' : 'bg-[#d7fff3]'
  const inputTextColor = isDark ? 'text-white' : 'text-[#00362d]'
  const placeholderColor = isDark ? 'placeholder:text-white/30' : 'placeholder:text-[#80b8aa]'
  const iconColor = isDark ? '#00684E' : '#4ad7b0'

  // Form for Email Step
  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required')
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const res = await authService.requestResetPassword({ email: values.email })
        if (res.success) {
          toast.success('OTP sent to your email')
          setEmail(values.email)
          setStep('OTP')
        } else {
          toast.error(res.message || 'Error occurred')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error occurred')
      } finally {
        setLoading(false)
      }
    }
  })

  // Form for Password Step
  const resetFormik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password: Yup.string().required('Password is required').min(8, 'Min 8 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required')
    }),
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const res = await authService.resetPassword({ password: values.password }, resetToken)
        if (res.success) {
          toast.success('Password reset successfully')
          onBackToLogin()
        } else {
          toast.error(res.message || 'Error occurred')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error occurred')
      } finally {
        setLoading(false)
      }
    }
  })

  const handleOtpChange = (index: number, val: string) => {
    if (val && !/^\d$/.test(val)) return
    const newOtp = [...otpArr]
    newOtp[index] = val
    setOtpArr(newOtp)
    if (val && index < 3) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpArr[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otp = otpArr.join('')
    if (otp.length < 4) {
      toast.error('Please enter all 4 digits')
      return
    }
    setLoading(true)
    try {
      const res = await authService.verifyResetPasswordOtp({ email, otp })
      if (res.success) {
        setResetToken(res.data.resetPasswordToken)
        setStep('RESET')
      } else {
        toast.error(res.message || 'Invalid OTP')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'EMAIL') {
    return (
      <form onSubmit={emailFormik.handleSubmit} className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
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
                  {...emailFormik.getFieldProps('email')}
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
          {emailFormik.touched.email && emailFormik.errors.email && (
            <p className="ml-1 mt-1 text-[11px] font-bold text-red-500">
              {emailFormik.errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !emailFormik.isValid}
          className={`h-[50px] w-full rounded-[10px] ${isDark ? 'bg-[#4ad7b0] text-black' : 'bg-[#00684e] text-[#c6ffe6]'} font-bold transition-all disabled:opacity-50`}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>

        <button
          type="button"
          onClick={onBackToLogin}
          className={`text-center text-[14px] font-bold ${textColor} hover:underline`}
        >
          Back to Login
        </button>
      </form>
    )
  }

  if (step === 'OTP') {
    return (
      <div className="space-y-8 pt-4 text-center">
        <div className="space-y-2">
          <h3 className={`text-2xl font-bold ${textColor}`}>OTP Verification</h3>
          <p className={`text-sm ${isDark ? 'text-[#00362d]/60' : 'text-white/40'}`}>
            Enter the 4-digit code sent to <span className={`font-bold ${textColor}`}>{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 py-4">
          {otpArr.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                otpRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className={`size-16 rounded-xl border-2 ${isDark ? 'border-[#bdfeed] text-[#00362d] focus:border-[#00684e]' : 'border-white/10 bg-white/5 text-white focus:border-[#4ad7b0]'} text-center text-3xl font-bold transition-colors focus:outline-none`}
            />
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <button
            className={`h-14 w-full rounded-xl ${isDark ? 'bg-[#4ad7b0] text-black' : 'bg-[#00684e] text-[#c6ffe6]'} text-lg font-bold transition-opacity disabled:opacity-50`}
            onClick={handleVerifyOtp}
            disabled={loading || otpArr.join('').length < 4}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            onClick={() => setStep('EMAIL')}
            className={`w-full text-sm font-bold ${isDark ? 'text-[#00362d]/60 hover:text-[#00362d]' : 'text-white/40 hover:text-white'}`}
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  if (step === 'RESET') {
    return (
      <form onSubmit={resetFormik.handleSubmit} className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Tagline */}
          <div className="mb-2">
            <h3 className={`text-xl font-bold ${textColor}`}>Reset Password</h3>
            <p className={`text-sm ${isDark ? 'text-[#00362d]/60' : 'text-white/40'}`}>
              Please enter your new password.
            </p>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label className={`text-[12px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
              New Password
            </label>
            <div className="relative">
              <div
                className={`rounded-[12px] ${inputBg} transition-all focus-within:ring-2 focus-within:ring-[#4ad7b0]/20`}
              >
                <div className="flex items-center px-12 py-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...resetFormik.getFieldProps('password')}
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
            {resetFormik.touched.password && resetFormik.errors.password && (
              <p className="ml-1 mt-1 text-[11px] font-bold text-red-500">
                {resetFormik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className={`text-[12px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
              Confirm Password
            </label>
            <div className="relative">
              <div
                className={`rounded-[12px] ${inputBg} transition-all focus-within:ring-2 focus-within:ring-[#4ad7b0]/20`}
              >
                <div className="flex items-center px-12 py-4">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...resetFormik.getFieldProps('confirmPassword')}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100"
              >
                <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 22 15">
                  <path d={SIGN_IN_SVG_PATHS.eye} fill={iconColor} />
                </svg>
              </button>
            </div>
            {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
              <p className="ml-1 mt-1 text-[11px] font-bold text-red-500">
                {resetFormik.errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !resetFormik.isValid}
          className={`h-[50px] w-full rounded-[10px] ${isDark ? 'bg-[#4ad7b0] text-black' : 'bg-[#00684e] text-[#c6ffe6]'} font-bold transition-all disabled:opacity-50`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    )
  }

  return null
}
