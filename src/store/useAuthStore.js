import { create } from 'zustand'
import { api } from '../services/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  otpPendingEmail: null,
  otpType: 'login',
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

  // ── Passwordless OTP flow ─────────────────────────────────────────────────

  /**
   * Step 1: Send OTP to email.
   * type: 'login' | 'register'
   */
  sendOtp: async ({ email, name, type = 'login' }) => {
    const res = await api.auth.sendOtp({ email, name, type })
    if (res?.success) {
      set({ otpPendingEmail: email, otpType: type })
      return res
    }
    throw new Error(res?.message || 'Failed to send OTP')
  },

  /**
   * Step 2: Verify OTP and sign in / create account.
   * type: 'login' | 'register'
   */
  verifyOtp: async ({ email, code, type, name }) => {
    const cleanEmail = email || get().otpPendingEmail
    const cleanType = type || get().otpType
    const res = await api.auth.verifyOtp({ email: cleanEmail, code, type: cleanType, name })
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

  setOtpPending: (email, type = 'login') => {
    set({ otpPendingEmail: email, otpType: type })
  },

  // ── Legacy shims (kept for any code that still calls login/register) ───────

  login: async ({ identifier, email, password } = {}) => {
    // Redirect to OTP flow
    const cleanEmail = (email || identifier || '').trim().toLowerCase()
    return get().sendOtp({ email: cleanEmail, type: 'login' })
  },

  register: async (details) => {
    const res = await api.auth.sendOtp({
      email: details.email?.trim().toLowerCase(),
      name: details.name?.trim(),
      type: 'register'
    })
    if (res?.success) {
      set({ otpPendingEmail: res.email || details.email, otpType: 'register' })
      return res
    }
    throw new Error(res?.message || 'Registration failed')
  },

  // ── Other ─────────────────────────────────────────────────────────────────

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
