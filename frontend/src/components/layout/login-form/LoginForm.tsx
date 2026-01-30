import { useState } from 'react'
import type { LoginRequest } from '@/shared/types'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { Button, Checkbox, Input, FormField, Divider } from '@/components'

interface LoginFormProps {
  role: 'customer' | 'staff'
}

export const LoginForm = ({ role }: LoginFormProps) => {
  const { mutate: login, isPending } = useLogin(role)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [rememberMe, setRememberMe] = useState(false)
  const showPassword = useState(false)

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
      <Divider className="mb-4" />

      {/* Email Input */}
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

      {/* Password Input */}
      <FormField label="Password" className="mb-4">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Input password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          size="lg"
        />
      </FormField>

      {/* Remember Me */}
      <div className="mb-6 flex items-center justify-between">
        <Checkbox
          isChecked={rememberMe}
          onCheckedChange={setRememberMe} // Check lại component Checkbox của bạn nhận props gì
          label="Remember me"
          size="sm"
        />
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          Forgot Password?
        </a>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        variant="solid"
        colorScheme="primary"
        isFullWidth
        size="lg"
        className="mb-4"
        // isLoading={isPending}
        disabled={isPending}
      >
        Log In
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <a href="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Sign Up
        </a>
      </p>
    </form>
  )
}
