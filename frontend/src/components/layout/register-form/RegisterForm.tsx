import { useState, useRef } from 'react'
import type { RegisterRequest } from '@/shared/types'
import { Gender } from '@/shared/utils/enums/gender.enum'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { authService } from '@/features/auth/services/auth.service'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { SIGN_UP_SVG_PATHS } from '@/shared/constants/svg-paths'

interface RegisterFormProps {
  onSubmit?: (data: RegisterRequest) => void
  isPending?: boolean
  variant?: 'light' | 'dark'
}

export const RegisterForm = ({
  isPending: _isPending = false,
  variant = 'light'
}: RegisterFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const registerMutation = useRegister()

  const isDark = variant === 'light'
  const textColor = isDark ? 'text-[#00362d]' : 'text-white'
  const labelColor = isDark ? 'text-[#00362d]' : 'text-[#4ad7b0]'
  const inputBg = isDark ? 'bg-white/5 border border-white/10' : 'bg-[#d7fff3]'
  const inputTextColor = isDark ? 'text-white' : 'text-[#00362d]'
  const placeholderColor = isDark ? 'placeholder:text-white/30' : 'placeholder:text-[#80b8aa]'
  const iconColor = isDark ? '#00684E' : '#4ad7b0'

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full Name is required')
      .min(2, 'Name must be at least 2 characters')
      .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Name cannot contain special characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone must contain numbers only')
      .matches(/^(0|84)\d{8,9}$/, 'Invalid phone number format (9-10 digits)'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    gender: Yup.string().required('Gender is required')
  })

  // States for merge flow
  const [mergeState, setMergeState] = useState<'idle' | 'prompt' | 'otp'>('idle')
  const [otpArr, setOtpArr] = useState(['', '', '', ''])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const blockNonDigits = (e: React.KeyboardEvent) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'Tab' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight' &&
      e.key !== 'Delete'
    ) {
      e.preventDefault()
    }
  }

  const formik = useFormik<RegisterRequest>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: Gender.MALE
    },
    validationSchema,
    onSubmit: (values) => {
      registerMutation.mutate(values, {
        onError: (err: any) => {
          if (err.response?.data?.code === 'EXIST_GOOGLE_OAUTH_ACCOUNT') {
            setMergeState('prompt')
          } else {
            toast.error(err.response?.data?.message || 'Registration failed')
          }
        }
      })
    }
  })

  const handleRequestMerge = async () => {
    setIsMerging(true)
    try {
      const res = await authService.requestMergeAccount({
        email: formik.values.email,
        password: formik.values.password
      })
      if (res.success) {
        toast.success('Merge request sent successfully. Please check your email for the OTP.')
        setMergeState('otp')
      } else {
        toast.error((res as any).message || 'Unable to request merge')
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Request merge error')
    } finally {
      setIsMerging(false)
    }
  }

  const handleVerifyOtp = async () => {
    const finalOtp = otpArr.join('')
    if (finalOtp.length < 4) {
      toast.error('Please enter all 4 OTP digits')
      return
    }
    setIsMerging(true)
    try {
      const res = await authService.verifyMergeOtp({
        email: formik.values.email,
        otp: finalOtp
      })
      if (res.success) {
        toast.success('Account merged successfully! You can log in now.')
        navigate('/login')
      } else {
        toast.error((res as any).message || 'Invalid OTP')
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Verify OTP error')
    } finally {
      setIsMerging(false)
    }
  }

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

  if (mergeState === 'prompt') {
    return (
      <div className="space-y-6 pt-6 text-center">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isDark ? 'bg-blue-50 text-blue-500' : 'bg-[#4ad7b0]/10 text-[#4ad7b0]'}`}
        >
          <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className={`text-xl font-bold ${textColor}`}>Account Already Exists</h3>
        <p className={`px-4 text-sm ${isDark ? 'text-[#00362d]/60' : 'text-white/40'}`}>
          Email <span className={`font-bold ${textColor}`}>{formik.values.email}</span> is already
          linked to a Google account. Do you want to merge this password into that account?
        </p>
        <div className="flex gap-4 pt-4">
          <button
            className={`h-12 flex-1 rounded-xl border ${isDark ? 'border-[#00684e]/20 text-[#00362d] hover:bg-gray-50' : 'border-white/10 text-white hover:bg-white/5'} font-bold transition-colors`}
            onClick={() => setMergeState('idle')}
          >
            Cancel
          </button>
          <button
            className={`h-12 flex-1 rounded-xl ${isDark ? 'bg-[#00684e] text-[#c6ffe6] hover:opacity-90' : 'bg-[#4ad7b0] text-black hover:bg-[#3bc7a0]'} font-bold transition-opacity disabled:opacity-50`}
            onClick={handleRequestMerge}
            disabled={isMerging}
          >
            Confirm
          </button>
        </div>
      </div>
    )
  }

  if (mergeState === 'otp') {
    return (
      <div className="space-y-8 pt-8 text-center">
        <div className="space-y-2">
          <h3 className={`text-2xl font-bold ${textColor}`}>OTP Verification</h3>
          <p className={`text-sm ${isDark ? 'text-[#00362d]/60' : 'text-white/40'}`}>
            Enter the 4-digit code sent to{' '}
            <span className={`font-bold ${textColor}`}>{formik.values.email}</span>
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
            className={`h-14 w-full rounded-xl ${isDark ? 'bg-[#00684e] text-[#c6ffe6] hover:opacity-90' : 'bg-[#4ad7b0] text-black hover:bg-[#3bc7a0]'} text-lg font-bold transition-opacity disabled:opacity-50`}
            onClick={handleVerifyOtp}
            disabled={isMerging || otpArr.join('').length < 4}
          >
            Confirm
          </button>
          <button
            onClick={() => setMergeState('idle')}
            className={`w-full text-sm font-bold ${isDark ? 'text-[#00362d]/60 hover:text-[#00362d]' : 'text-white/40 hover:text-white'}`}
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        {/* Full Name */}
        <div className="flex flex-col gap-0.5">
          <label className={`text-[11px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Full Name
          </label>
          <div className="relative">
            <div
              className={`rounded-[10px] ${inputBg} focus-within:ring-1 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-11 py-2.5">
                <input
                  type="text"
                  placeholder="Alex Sterling"
                  {...formik.getFieldProps('name')}
                  className={`w-full bg-transparent text-[15px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="size-[13.33px]" fill="none" viewBox="0 0 13.33 13.33">
                <path d={SIGN_UP_SVG_PATHS.user} fill={iconColor} />
              </svg>
            </div>
          </div>
          {formik.touched.name && formik.errors.name && (
            <p className="ml-1 mt-0.5 text-[11px] font-bold text-red-500">{formik.errors.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-0.5">
          <label className={`text-[11px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Email Address
          </label>
          <div className="relative">
            <div
              className={`rounded-[10px] ${inputBg} focus-within:ring-1 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-11 py-2.5">
                <input
                  type="email"
                  placeholder="alex@atelier.com"
                  {...formik.getFieldProps('email')}
                  className={`w-full bg-transparent text-[15px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="size-[16.67px]" fill="none" viewBox="0 0 16.67 13.33">
                <path d={SIGN_UP_SVG_PATHS.email} fill={iconColor} />
              </svg>
            </div>
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="ml-1 mt-0.5 text-[11px] font-bold text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-0.5">
          <label className={`text-[11px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Phone Number
          </label>
          <div className="relative">
            <div
              className={`rounded-[10px] ${inputBg} focus-within:ring-1 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-11 py-2.5">
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...formik.getFieldProps('phone')}
                  onKeyDown={blockNonDigits}
                  className={`w-full bg-transparent text-[15px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="size-[15px]" fill="none" viewBox="0 0 15 15">
                <path d={SIGN_UP_SVG_PATHS.phone} fill={iconColor} />
              </svg>
            </div>
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <p className="ml-1 mt-0.5 text-[11px] font-bold text-red-500">{formik.errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-0.5">
          <label className={`text-[11px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Password
          </label>
          <div className="relative">
            <div
              className={`rounded-[10px] ${inputBg} focus-within:ring-1 focus-within:ring-[#4ad7b0]/20`}
            >
              <div className="flex items-center px-11 py-2.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...formik.getFieldProps('password')}
                  className={`w-full bg-transparent text-[15px] ${inputTextColor} outline-none ${placeholderColor}`}
                />
              </div>
            </div>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="h-[17.5px] w-[13.33px]" fill="none" viewBox="0 0 13.33 17.5">
                <path d={SIGN_UP_SVG_PATHS.password} fill={iconColor} />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100"
            >
              <svg className="h-[15px] w-[22px]" fill="none" viewBox="0 0 22 15">
                <path d={SIGN_UP_SVG_PATHS.eye} fill={iconColor} />
              </svg>
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="ml-1 mt-0.5 text-[11px] font-bold text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col gap-1 pb-2">
          <label className={`text-[11px] font-bold uppercase tracking-[1.2px] ${labelColor}`}>
            Gender
          </label>
          <div className="flex gap-4">
            {[
              { label: 'Male', value: Gender.MALE },
              { label: 'Female', value: Gender.FEMALE },
              { label: 'Other', value: Gender.NON_BINARY }
            ].map((g) => (
              <label
                key={g.value}
                className="flex cursor-pointer items-center gap-2"
                onClick={() => formik.setFieldValue('gender', g.value)}
              >
                <div
                  className={`relative size-3.5 rounded-full border border-[#4ad7b0] transition-colors ${
                    formik.values.gender === g.value
                      ? 'bg-[#4ad7b0]'
                      : isDark
                        ? 'bg-[#d7fff3]'
                        : 'bg-white/5'
                  }`}
                >
                  {formik.values.gender === g.value && (
                    <div
                      className={`absolute inset-0.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
                    />
                  )}
                </div>
                <span
                  className={`text-[13px] font-medium ${isDark ? 'text-[#00362d]' : 'text-white/60'}`}
                >
                  {g.label}
                </span>
              </label>
            ))}
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <p className="ml-1 mt-0.5 text-[11px] font-bold text-red-500">{formik.errors.gender}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending || !formik.isValid}
          className={`relative flex h-[60px] w-full cursor-pointer items-center justify-center rounded-[12px] ${isDark ? 'bg-[#00684e] text-[#c6ffe6] hover:opacity-90' : 'bg-[#4ad7b0] text-black hover:bg-[#3bc7a0]'} text-lg font-bold shadow-[0_10px_15px_-3px_rgba(0,104,78,0.2)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className={`text-center text-[16px] ${isDark ? 'text-[#00362d]' : 'text-white/40'}`}>
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from: (location.state as any)?.from }}
            className={`font-bold ${isDark ? 'text-[#00684e]' : 'text-[#4ad7b0]'} hover:underline`}
          >
            Log In
          </Link>
        </p>
      </div>
    </form>
  )
}
