import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import type { LoginRequest } from '@/shared/types'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { Button, Checkbox, Input, FormField, Divider } from '@/components'
import { getOrCreateDeviceId } from '@/shared/utils/device.utils'
import { ENDPOINTS } from '@/api/endpoints'

interface LoginFormProps {
  role?: string
}

export const LoginForm = ({ role: _role }: LoginFormProps) => {
  const { mutate: login, isPending } = useLogin()

  const handleGoogleLogin = () => {
    const deviceId = getOrCreateDeviceId()
    const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1`
    const googleAuthUrl = `${baseUrl}${ENDPOINTS.AUTH.GOOGLE}?state=${deviceId}`
    window.location.href = googleAuthUrl
  }

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isValidEmail = formData.email.includes('@') && formData.email.includes('.')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      email: formData.email,
      password: formData.password
    }
    if (!formData.email || !formData.password) return

    login(payload)
  }

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <FormField label="Email" className="mb-4">
        <Input
          type="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          size="lg"
          rightElement={
            isValidEmail ? (
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
      </FormField>

      <FormField label="Password" className="mb-4">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Input password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          size="lg"
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
      </FormField>

      <div className="mb-6 flex items-center justify-between">
        <Checkbox
          isChecked={rememberMe}
          onCheckedChange={setRememberMe}
          label="Remember me"
          size="sm"
        />
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        variant="solid"
        colorScheme="primary"
        isFullWidth
        size="lg"
        className="mb-4"
        disabled={isPending}
      >
        Log In
      </Button>

      <Divider className="mb-4" />

      <button
        type="button"
        className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
        onClick={handleGoogleLogin}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.5.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign in with Google
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Sign Up
        </Link>
      </p>
      {_role !== 'staff' && (
        <div className="mt-6 pt-2 border-t border-gray-100 text-center">
          <span className="text-xs text-gray-400">Are you a staff member? </span>
          <Link
            to="/admin/login"
            className="text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors"
          >
            Staff Portal
          </Link>
        </div>
      )}
    </form>
  )
}
