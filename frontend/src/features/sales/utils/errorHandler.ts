import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  success: boolean
  message?: string
  error?: string
  errors?: Array<{ field: string; message: string }>
  data?: unknown
}

export class SalesStaffErrorHandler {
  public static extractErrorMessage(error: unknown): string {
    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>

      if (axiosError.response?.data) {
        const data = axiosError.response.data

        if (data.message) return data.message
        if (data.error) return data.error

        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          return data.errors.map((err) => `${err.field}: ${err.message}`).join(', ')
        }
      }

      if (axiosError.response?.statusText) {
        return axiosError.response.statusText
      }

      if (axiosError.message) {
        if (axiosError.message.includes('Network Error')) {
          return 'Network connection failed. Please check your internet connection.'
        }
        if (axiosError.message.includes('timeout')) {
          return 'Request timeout. Please try again.'
        }
        return axiosError.message
      }
    }

    if (error instanceof Error) {
      return error.message
    }

    if (typeof error === 'string') {
      return error
    }

    return 'An unexpected error occurred. Please try again.'
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as AxiosError).isAxiosError === true
    )
  }

  static showError(error: unknown, customMessage?: string): void {
    const message = customMessage || this.extractErrorMessage(error)

    toast.error(message, {
      duration: 4000,
      style: {
        background: '#fef2f2',
        color: '#991b1b',
        border: '1px solid #fecaca',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
        maxWidth: '500px'
      },
      iconTheme: {
        primary: '#dc2626',
        secondary: '#fff'
      }
    })
  }

  static showSuccess(message: string): void {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#ecfdf5',
        color: '#065f46',
        border: '1px solid #a7f3d0',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
        maxWidth: '500px'
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff'
      }
    })
  }

  static showWarning(message: string): void {
    toast(message, {
      duration: 3500,
      icon: '⚠️',
      style: {
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fde68a',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
        maxWidth: '500px'
      }
    })
  }

  static showInfo(message: string): void {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#eff6ff',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
        maxWidth: '500px'
      }
    })
  }

  static async handleAsync<T>(
    operation: () => Promise<T>,
    options?: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (data: T) => void
      onError?: (error: unknown) => void
    }
  ): Promise<T | null> {
    try {
      const result = await operation()

      if (options?.successMessage) {
        this.showSuccess(options.successMessage)
      }

      if (options?.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (error) {
      this.showError(error, options?.errorMessage)

      if (options?.onError) {
        options.onError(error)
      }

      return null
    }
  }
}

export const showError = SalesStaffErrorHandler.showError.bind(SalesStaffErrorHandler)
export const showSuccess = SalesStaffErrorHandler.showSuccess.bind(SalesStaffErrorHandler)
export const showWarning = SalesStaffErrorHandler.showWarning.bind(SalesStaffErrorHandler)
export const showInfo = SalesStaffErrorHandler.showInfo.bind(SalesStaffErrorHandler)
export const handleAsync = SalesStaffErrorHandler.handleAsync.bind(SalesStaffErrorHandler)
export const extractErrorMessage =
  SalesStaffErrorHandler.extractErrorMessage.bind(SalesStaffErrorHandler)
