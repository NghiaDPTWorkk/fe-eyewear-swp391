import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

/**
 * Error response structure from backend
 */
interface ApiErrorResponse {
  success: boolean
  message?: string
  error?: string
  errors?: Array<{ field: string; message: string }>
  data?: unknown
}

/**
 * Sales Staff Error Handler
 * Extracts error messages from API responses and displays them with OpticView color scheme
 */
export class SalesStaffErrorHandler {
  /**
   * Extract error message from various error formats
   */
  private static extractErrorMessage(error: unknown): string {
    // Handle Axios errors
    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>

      // Check response data for error message
      if (axiosError.response?.data) {
        const data = axiosError.response.data

        // Priority 1: Explicit error message
        if (data.message) return data.message
        if (data.error) return data.error

        // Priority 2: Validation errors array
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          return data.errors.map((err) => `${err.field}: ${err.message}`).join(', ')
        }
      }

      // Fallback to status text
      if (axiosError.response?.statusText) {
        return axiosError.response.statusText
      }

      // Network errors
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

    // Handle standard Error objects
    if (error instanceof Error) {
      return error.message
    }

    // Handle string errors
    if (typeof error === 'string') {
      return error
    }

    // Fallback for unknown error types
    return 'An unexpected error occurred. Please try again.'
  }

  /**
   * Type guard for Axios errors
   */
  private static isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      (error as AxiosError).isAxiosError === true
    )
  }

  /**
   * Display error toast with OpticView mint/emerald color scheme
   */
  static showError(error: unknown, customMessage?: string): void {
    const message = customMessage || this.extractErrorMessage(error)

    toast.error(message, {
      duration: 4000,
      style: {
        background: '#fef2f2', // rose-50
        color: '#991b1b', // rose-800
        border: '1px solid #fecaca', // rose-200
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
        maxWidth: '500px'
      },
      iconTheme: {
        primary: '#dc2626', // rose-600
        secondary: '#fff'
      }
    })
  }

  /**
   * Display success toast with OpticView mint color scheme
   */
  static showSuccess(message: string): void {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#ecfdf5', // emerald-50
        color: '#065f46', // emerald-800
        border: '1px solid #a7f3d0', // emerald-200
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
        maxWidth: '500px'
      },
      iconTheme: {
        primary: '#10b981', // emerald-500
        secondary: '#fff'
      }
    })
  }

  /**
   * Display warning toast
   */
  static showWarning(message: string): void {
    toast(message, {
      duration: 3500,
      icon: '⚠️',
      style: {
        background: '#fffbeb', // amber-50
        color: '#92400e', // amber-800
        border: '1px solid #fde68a', // amber-200
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
        maxWidth: '500px'
      }
    })
  }

  /**
   * Display info toast
   */
  static showInfo(message: string): void {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      style: {
        background: '#eff6ff', // blue-50
        color: '#1e40af', // blue-800
        border: '1px solid #bfdbfe', // blue-200
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '14px 20px',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
        maxWidth: '500px'
      }
    })
  }

  /**
   * Handle async operation with automatic error display
   */
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

// Export convenience functions
export const showError = SalesStaffErrorHandler.showError.bind(SalesStaffErrorHandler)
export const showSuccess = SalesStaffErrorHandler.showSuccess.bind(SalesStaffErrorHandler)
export const showWarning = SalesStaffErrorHandler.showWarning.bind(SalesStaffErrorHandler)
export const showInfo = SalesStaffErrorHandler.showInfo.bind(SalesStaffErrorHandler)
export const handleAsync = SalesStaffErrorHandler.handleAsync.bind(SalesStaffErrorHandler)
