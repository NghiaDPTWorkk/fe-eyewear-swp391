import { useState, useRef } from 'react'
import { Button, Divider, FormField, Input } from '@/components'
import { Eye, EyeOff } from 'lucide-react'
import type { RegisterRequest } from '@/shared/types'
import { Gender } from '@/shared/utils/enums/gender.enum'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { authService } from '@/features/auth/services/auth.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface RegisterFormProps {
  onSubmit?: (data: RegisterRequest) => void
  isPending?: boolean
}

export const RegisterForm = ({ isPending = false }: RegisterFormProps) => {
  const navigate = useNavigate()
  const registerMutation = useRegister()

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
      <div className="w-full text-center space-y-6 pt-6">
        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Account Already Exists</h3>
        <p className="text-gray-500 text-sm px-4">
          Email <span className="font-bold text-black">{formik.values.email}</span> is already linked
          to a Google account. Do you want to merge this password into that account?
        </p>
        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1" onClick={() => setMergeState('idle')}>
            Cancel
          </Button>
          <Button
            colorScheme="primary"
            className="flex-1"
            onClick={handleRequestMerge}
            disabled={isMerging}
          >
            Confirm
          </Button>
        </div>
      </div>
    )
  }

  if (mergeState === 'otp') {
    return (
      <div className="w-full text-center space-y-8 pt-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-mint-1200">OTP Verification</h3>
          <p className="text-gray-500 text-sm">
            Enter the 4-digit code sent to{' '}
            <span className="font-bold text-black">{formik.values.email}</span>
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
              className="w-16 h-16 text-center text-3xl font-bold border-2 border-mint-300 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <Button
            colorScheme="primary"
            size="lg"
            isFullWidth
            onClick={handleVerifyOtp}
            disabled={isMerging || otpArr.join('').length < 4}
          >
            Confirm
          </Button>
          <Button
            variant="ghost"
            isFullWidth
            onClick={() => setMergeState('idle')}
            className="text-gray-500"
          >
            Go back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <Divider className="mb-4" />

      {/* Name Input */}
      <FormField label="Full Name" className="mb-6">
        <Input
          type="text"
          placeholder="Enter your full name"
          {...formik.getFieldProps('name')}
          size="lg"
          className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{formik.errors.name}</p>
        )}
      </FormField>

      {/* Email Input */}
      <FormField label="Email" className="mb-6">
        <Input
          type="email"
          placeholder="example@gmail.com"
          {...formik.getFieldProps('email')}
          size="lg"
          className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
          rightElement={
            formik.values.email && !formik.errors.email ? (
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : undefined
          }
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{formik.errors.email}</p>
        )}
      </FormField>

      {/* Phone Input */}
      <FormField label="Phone Number" className="mb-6">
        <Input
          type="tel"
          placeholder="0123456789"
          {...formik.getFieldProps('phone')}
          onKeyDown={blockNonDigits}
          size="lg"
          className={formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}
          rightElement={
            formik.values.phone && !formik.errors.phone ? (
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : undefined
          }
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{formik.errors.phone}</p>
        )}
      </FormField>

      {/* Password Input */}
      <FormField label="Password" className="mb-6">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Input password"
          {...formik.getFieldProps('password')}
          size="lg"
          className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-[11px] text-red-500 font-bold mt-1 ml-1">{formik.errors.password}</p>
        )}
      </FormField>

      {/* Gender Selection */}
      <FormField label="Gender" className="mb-6">
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.MALE}
              checked={formik.values.gender === Gender.MALE}
              onChange={() => formik.setFieldValue('gender', Gender.MALE)}
              className="mr-2"
            />
            <span>Male</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.FEMALE}
              checked={formik.values.gender === Gender.FEMALE}
              onChange={() => formik.setFieldValue('gender', Gender.FEMALE)}
              className="mr-2"
            />
            <span>Female</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.NON_BINARY}
              checked={formik.values.gender === Gender.NON_BINARY}
              onChange={() => formik.setFieldValue('gender', Gender.NON_BINARY)}
              className="mr-2"
            />
            <span>Other</span>
          </label>
        </div>
      </FormField>

      {/* Register Button */}
      <Button
        type="submit"
        variant="solid"
        colorScheme="primary"
        isFullWidth
        size="lg"
        className="mb-4 h-12 rounded-xl text-sm font-bold shadow-lg shadow-mint-100"
        disabled={isPending || registerMutation.isPending || !formik.isValid}
      >
        Sign Up
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Log In
        </a>
      </p>
    </form>
  )
}
