import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, LoginResponse } from '@/shared/types'
import { useNavigate, useLocation } from 'react-router-dom'
import { authApi } from '../services/auth.api.legacy'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'
import { useCartStore } from '@/store/cart.store'
import { showError, showSuccess } from '@/features/sale-staff/utils/errorHandler'
import { queryClient } from '@/lib/react-query'

import { UserRole, ROLE_MAP } from '@/shared/constants/user-role'
import { MESSAGES, ERROR_MESSAGES } from '@/shared/constants/messages'

const getRolePath = (role: string): string => {
  const normalizedRole = role.toUpperCase().replace(/\s+/g, '_')
  const roleId = ROLE_MAP[normalizedRole] || UserRole.CUSTOMER

  const rolePathMap: Record<UserRole, string> = {
    [UserRole.CUSTOMER]: 'customer',
    [UserRole.SALE_STAFF]: 'sale-staff',
    [UserRole.OPERATION_STAFF]: 'operation-staff',
    [UserRole.MANAGER]: 'manager',
    [UserRole.ADMIN]: 'admin',
    [UserRole.STAFF]: 'staff'
  }

  return rolePathMap[roleId] || 'customer'
}

export const useLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, fetchProfile } = useAuthStore()
  const { fetchCart } = useCartStore()

  const isStaffLogin = () => {
    return location.pathname.toLowerCase().includes('/admin/')
  }

  return useMutation({
    mutationFn: (payload: LoginRequest) => {
      if (isStaffLogin()) {
        return authApi.loginStaff(payload)
      }
      return authApi.loginCustomer(payload)
    },
    onSuccess: async (response: LoginResponse) => {
      const authData = (response as any).data || response

      const token = authData.token || authData.accessToken || (response as any).token

      if (!token) {
        const tokenError = MESSAGES.COMMON.INVALID_DATA
        if (isStaffLogin()) {
          showError(tokenError)
        } else {
          toast.error(tokenError)
        }
        return
      }

      localStorage.setItem('access_token', token)
      setToken(token)

      try {
        queryClient.clear()
        await fetchProfile()
      } catch (error) {
        console.error('Failed to fetch profile after login:', error)
      }

      if (!isStaffLogin()) {
        try {
          await fetchCart()
        } catch (error) {
          console.error('Failed to fetch cart after login:', error)
        }
      }

      if (isStaffLogin()) {
        showSuccess(
          MESSAGES.STAFF.AUTH?.LOGIN_SUCCESS ||
            'Login successful! Welcome to OpticView Staff Portal'
        )
      } else {
        toast.success(MESSAGES.CUSTOMER.AUTH.LOGIN_SUCCESS)
      }

      const roleFromToken = useAuthStore.getState().role

      if (!roleFromToken && !isStaffLogin()) {
        const from = (location.state as any)?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else if (roleFromToken) {
        const rolePath = getRolePath(roleFromToken)
        navigate(`/${rolePath}/dashboard`)
      } else {
        console.error('Unexpected state: roleFromToken and isStaffLogin mismatch')
        navigate('/')
      }
    },
    onError: (error: any) => {
      const loginError = error.message || ERROR_MESSAGES.AUTH.LOGIN_FAILED
      if (isStaffLogin()) {
        showError(error, loginError)
      } else {
        toast.error(loginError)
      }
      console.error('Login failed', error)
    }
  })
}
