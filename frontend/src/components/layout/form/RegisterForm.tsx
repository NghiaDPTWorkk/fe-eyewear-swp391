import { useState } from 'react'
import { Divider } from '@/components/atoms/divider'
import type { CreateCustomerRequest } from '@/shared/types/customer.types'
import { Gender } from '@/shared/types/enums'
import { FormField } from '@/components/molecules'
import { Button, Input } from '@/components/atoms'

interface RegisterFormProps {
  onSubmit?: (data: CreateCustomerRequest) => void
  isPending?: boolean
}

export const RegisterForm = ({ onSubmit, isPending = false }: RegisterFormProps) => {
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: Gender.MALE
  })

  const [showPassword, setShowPassword] = useState(false)

  const isValidEmail = formData.email.includes('@') && formData.email.includes('.')
  const isValidPhone = /^[0-9]{10,11}$/.test(formData.phone)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      return
    }

    onSubmit?.(formData)
  }

  const handleChange = (field: keyof CreateCustomerRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Divider className="mb-4" />

      {/* Name Input */}
      <FormField label="Full Name" className="mb-4">
        <Input
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          size="lg"
          required
        />
      </FormField>

      {/* Email Input */}
      <FormField label="Email" className="mb-4">
        <Input
          type="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          size="lg"
          required
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

      {/* Phone Input */}
      <FormField label="Phone Number" className="mb-4">
        <Input
          type="tel"
          placeholder="0123456789"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          size="lg"
          required
          rightElement={
            isValidPhone ? (
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
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />
      </FormField>

      {/* Gender Selection */}
      <FormField label="Gender" className="mb-4">
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.MALE}
              checked={formData.gender === Gender.MALE}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="mr-2"
            />
            <span>Male</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.FEMALE}
              checked={formData.gender === Gender.FEMALE}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="mr-2"
            />
            <span>Female</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={Gender.NON_BINARY}
              checked={formData.gender === Gender.NON_BINARY}
              onChange={(e) => handleChange('gender', e.target.value)}
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
        className="mb-4"
        disabled={isPending}
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
