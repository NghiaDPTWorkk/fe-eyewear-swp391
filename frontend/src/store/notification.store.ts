import { create } from 'zustand'

export type NotificationType =
  | 'INVOICE_CREATE'
  | 'ASSIGN_ORDER'
  | 'ASSIGN_INVOICE'
  | 'COMPLETE_INVOICE'

export type NotificationMetadata = {
  invoiceId?: string
  orderId?: string
}

export interface AppNotification {
  _id: string
  title: string
  type: NotificationType
  message: string
  metadata: NotificationMetadata
  createdAt: string
  isRead: boolean
}

interface NotificationState {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (notif: AppNotification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

const MAX_NOTIFICATIONS = 50

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notif) =>
    set((state) => {
      const notifications = [notif, ...state.notifications].slice(0, MAX_NOTIFICATIONS)
      const unreadCount = state.unreadCount + (notif.isRead ? 0 : 1)
      return { notifications, unreadCount }
    }),

  markAsRead: (notificationId) =>
    set((state) => {
      let dec = 0
      const notifications = state.notifications.map((n) => {
        if (n._id !== notificationId) return n
        if (!n.isRead) dec = 1
        return { ...n, isRead: true }
      })
      return { notifications, unreadCount: Math.max(0, state.unreadCount - dec) }
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 })
}))
