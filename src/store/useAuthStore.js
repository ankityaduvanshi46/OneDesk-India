import { create } from 'zustand'
import { api } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  otpPendingEmail: null,
  otpType: 'email_verification',
  notifications: [],
  unreadNotificationsCount: 0,

  checkAuth: async () => {
    try {
      set({ loading: true })
      const res = await api.auth.getMe()
      if (res?.success && res.user) {
        set({ user: res.user, isAuthenticated: true, loading: false })
        get().fetchNotifications()
        return res.user
      } else {
        set({ user: null, isAuthenticated: false, loading: false })
        return null
      }
    } catch {
      set({ user: null, isAuthenticated: false, loading: false })
      return null
    }
  },

  login: async (credentials) => {
    const res = await api.auth.login(credentials)
    if (res?.success && res.user) {
      set({ user: res.user, isAuthenticated: true })
      get().fetchNotifications()
      return res.user
    }
    throw new Error(res?.message || 'Login failed')
  },

  register: async (details) => {
    const res = await api.auth.register(details)
    if (res?.success) {
      set({ otpPendingEmail: res.email, otpType: 'email_verification' })
      return res
    }
    throw new Error(res?.message || 'Registration failed')
  },

  verifyOtp: async (code) => {
    const email = get().otpPendingEmail
    const type = get().otpType
    const res = await api.auth.verifyOtp({ email, code, type })
    if (res?.success && res.user) {
      set({ user: res.user, isAuthenticated: true, otpPendingEmail: null })
      get().fetchNotifications()
      return res.user
    }
    throw new Error(res?.message || 'Verification failed')
  },

  resendOtp: async () => {
    const email = get().otpPendingEmail
    const type = get().otpType
    return api.auth.resendOtp({ email, type })
  },

  setOtpPending: (email, type = 'email_verification') => {
    set({ otpPendingEmail: email, otpType: type })
  },

  logout: async () => {
    try {
      await api.auth.logout()
    } catch {
    } finally {
      set({ user: null, isAuthenticated: false, notifications: [], unreadNotificationsCount: 0 })
    }
  },

  updateUser: (updatedUser) => {
    set({ user: { ...get().user, ...updatedUser } })
  },

  fetchNotifications: async () => {
    try {
      if (!get().isAuthenticated) return
      const res = await api.notifications.getAll()
      if (res?.success) {
        set({
          notifications: res.notifications || [],
          unreadNotificationsCount: res.unreadCount || 0
        })
      }
    } catch {
    }
  },

  markNotificationRead: async (id) => {
    try {
      await api.notifications.markRead(id)
      set((s) => ({
        notifications: s.notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
        unreadNotificationsCount: Math.max(0, s.unreadNotificationsCount - 1)
      }))
    } catch {
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await api.notifications.markAllRead()
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
        unreadNotificationsCount: 0
      }))
    } catch {
    }
  }
}))
