import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, User, LogOut, ShieldCheck, FileText, PlusCircle, LifeBuoy, Award } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import SearchBar from './SearchBar'
import SettingsPanel from './SettingsPanel'
import Logo from './Logo'

export default function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme, toggleTheme, language, toggleLanguage } = useAppStore()
  const { user, isAuthenticated, logout, notifications, unreadNotificationsCount, markNotificationRead } = useAuthStore()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)

  const userMenuRef = useRef(null)
  const notifMenuRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-royal-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-royal-800'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-3">
        <Link
          to="/"
          className="flex items-center shrink-0 focus-visible:ring-2 rounded-xl"
          aria-label={t('siteName') + ' – Home'}
        >
          <Logo size="md" />
        </Link>

        <div className="flex-1 max-w-sm mx-2 hidden sm:block">
          <SearchBar compact />
        </div>

        <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Main navigation">
          <Link
            to="/services"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400 rounded-lg transition-colors"
          >
            {t('nav.services')}
          </Link>
          <Link
            to="/apply"
            className="px-3 py-1.5 text-xs font-semibold text-saffron hover:underline rounded-lg transition-colors"
          >
            Apply Online
          </Link>
          <Link
            to="/wizard"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400 rounded-lg transition-colors"
          >
            {t('nav.wizard')}
          </Link>
          <Link
            to="/scam-check"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400 rounded-lg transition-colors"
          >
            {t('nav.scamCheck')}
          </Link>
          <Link
            to="/verify-document"
            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline rounded-lg transition-colors"
          >
            Verify Certificate
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-2">
          {isAuthenticated ? (
            <>
              <div className="relative" ref={notifMenuRef}>
                <button
                  type="button"
                  onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                  className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors relative border border-gray-200 dark:border-royal-700"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-royal-850 rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-royal-800 flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">Notifications</span>
                      <span className="text-[10px] text-gray-400">{unreadNotificationsCount} unread</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 dark:divide-royal-800 text-xs">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-xs">No notifications yet.</div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markNotificationRead(n._id)
                              if (n.link) navigate(n.link)
                              setNotifMenuOpen(false)
                            }}
                            className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-royal-800 transition-colors ${
                              !n.read ? 'bg-gold-500/5 font-semibold' : 'text-gray-600 dark:text-gray-300'
                            }`}
                          >
                            <div className="font-bold text-gray-900 dark:text-white text-xs">{n.title}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-gray-100 dark:bg-royal-800 hover:bg-gold-500/10 border border-gray-200 dark:border-royal-700 transition-all"
                >
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[100px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-saffron to-gold-500 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-royal-850 rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700 py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-royal-800">
                      <div className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">ID: {user?.registerId}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Citizen Dashboard</span>
                      </Link>

                      <Link
                        to="/apply"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-saffron" />
                        <span>Apply for Service</span>
                      </Link>

                      <Link
                        to="/documents"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>My Document Locker</span>
                      </Link>

                      <Link
                        to="/support"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <LifeBuoy className="w-3.5 h-3.5 text-gold-500" />
                        <span>Citizen Helpdesk</span>
                      </Link>

                      {(user?.role === 'staff' || user?.role === 'super_admin') && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-gold-500 font-bold bg-gold-500/10 hover:bg-gold-500/20"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100 dark:border-royal-800">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-luxury px-3.5 py-1.5 text-xs font-bold shrink-0"
              >
                Register
              </Link>
            </div>
          )}

          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors border border-gray-200 dark:border-royal-700"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            {language === 'en' ? 'हि' : 'En'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors border border-gray-200 dark:border-royal-700"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchBar compact />
      </div>

      <AnimatePresence>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </header>
  )
}
