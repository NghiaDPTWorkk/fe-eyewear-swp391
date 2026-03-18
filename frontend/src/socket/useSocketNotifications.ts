import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import { emittedEvent, UserRole } from '@/shared/constants'
import { useAuthStore } from '@/store/auth.store'
import { useNotificationStore, type AppNotification } from '@/store/notification.store'
import { createSocket, disconnectSocket, type SocketUserType } from './socketClient'

const resolveUserType = (role: string | null): SocketUserType => {
  if (!role) return 'CUSTOMER'
  if (role === UserRole.CUSTOMER) return 'CUSTOMER'
  return 'STAFF'
}

export const useSocketNotifications = () => {
  const token = useAuthStore((state) => state.accessToken)
  const role = useAuthStore((state) => state.role)
  const addNotification = useNotificationStore((state) => state.addNotification)

  const handleNewNotification = useCallback(
    (notification: AppNotification) => {
      addNotification(notification)
      toast(notification.title, {
        description: notification.message
      })
    },
    [addNotification]
  )

  useEffect(() => {
    if (!token) {
      disconnectSocket()
      return
    }

    const userType = resolveUserType(role)
    const socket = createSocket(token, userType)

    const onInvoiceCreate = (data: { newNotification: AppNotification }) => {
      handleNewNotification(data.newNotification)
    }

    const onAssignOrder = (data: { newNotification: AppNotification }) => {
      handleNewNotification(data.newNotification)
    }

    const onAssignInvoice = (data: { newNotification: AppNotification }) => {
      handleNewNotification(data.newNotification)
    }

    const onCompleteInvoice = (data: { newNotification: AppNotification }) => {
      handleNewNotification(data.newNotification)
    }

    socket.on(emittedEvent.notification.RECEIVE_INVOICE_CREATE, onInvoiceCreate)
    socket.on(emittedEvent.notification.RECEIVE_ASSIGN_ORDER, onAssignOrder)
    socket.on(emittedEvent.notification.RECEIVE_ASSIGN_INVOICE, onAssignInvoice)
    socket.on(emittedEvent.notification.RECEIVE_COMPLETE_INVOICE, onCompleteInvoice)

    return () => {
      socket.off(emittedEvent.notification.RECEIVE_INVOICE_CREATE, onInvoiceCreate)
      socket.off(emittedEvent.notification.RECEIVE_ASSIGN_ORDER, onAssignOrder)
      socket.off(emittedEvent.notification.RECEIVE_ASSIGN_INVOICE, onAssignInvoice)
      socket.off(emittedEvent.notification.RECEIVE_COMPLETE_INVOICE, onCompleteInvoice)
      disconnectSocket()
    }
  }, [token, role, handleNewNotification])
}
