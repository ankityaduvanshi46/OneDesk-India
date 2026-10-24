import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  User,
  LogOut,
  ShieldCheck,
  FileText,
  PlusCircle,
  LifeBuoy,
  Award,
  Users,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Search,
  ExternalLink,
  Compass,
  CheckCircle2
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import SearchBar from './SearchBar'
import SettingsPanel from './SettingsPanel'
import Logo from './Logo'
import {
  IdentityIllustration,
  TransportIllustration,
  CertificatesIllustration,
  TaxFinanceIllustration,
  HealthIllustration,
  AgricultureIllustration
} from './design-system/ServiceIllustrations'

const MEGA_MENU_CATEGORIES = [
  {
    name: 'Identity & Citizenship',
    nameHi: 'पहचान एवं नागरिकता',
    desc: 'Aadhaar, Passport, Voter ID & Biometrics',
    icon: IdentityIllustration,
    to: '/services?category=identity'
  },
  {
    name: 'Transport & Driving',
    nameHi: 'परिवहन एवं ड्राइविंग',
    desc: 'Driving Licence, RC, Vahan & Sarathi',
    icon: TransportIllustration,
    to: '/services?category=transport'
  },
  {
    name: 'Certificates & Revenue',
    nameHi: 'प्रमाण पत्र एवं राजस्व',
    desc: 'Income, Caste, Domicile & Birth Certificate',
    icon: CertificatesIllustration,
    to: '/services?category=certificates'
  },
  {
    name: 'Tax & Finance',
    nameHi: 'कर एवं वित्त',
    desc: 'PAN Card, GST Portal, ITR Filing & NSDL',
    icon: TaxFinanceIllustration,
    to: '/services?category=taxes'
  },
  {
    name: 'Healthcare & Wellness',
    nameHi: 'स्वास्थ्य सेवाएं',
    desc: 'Ayushman Bharat Card, ABHA Health ID',
    icon: HealthIllustration,
    to: '/services?category=health'
  },
  {
    name: 'Land & Agriculture',
    nameHi: 'भूमि एवं कृषि',
    desc: 'PM Kisan, Bhulekh, Khasra & Land Records',
    icon: AgricultureIllustration,
    to: '/services?category=agriculture'
  }
]

export default function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme, language, toggleLanguage } = useAppStore()
  const { user, isAuthenticated, logout, notifications, unreadNotificationsCount, markNotificationRead } = useAuthStore()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const userMenuRef = useRef(null)
  const notifMenuRef = useRef(null)
  const megaMenuRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMegaMenuOpen(false)
    setMobileDrawerOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifMenuOpen(false)
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setMobileDrawerOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-royal-900/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-royal-800'
          : 'bg-white/80 dark:bg-royal-900/80 backdrop-blur-sm'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-3">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus-visible:ring-2 rounded-xl"
          aria-label={t('siteName') + ' – Home'}
        >
          <Logo size="md" />
        </Link>

        {/* Global Compact Search Bar */}
        <div className="flex-1 max-w-sm mx-2 hidden md:block">
          <SearchBar compact />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Main navigation">
          {/* Services with Mega-Menu Trigger */}
          <div className="relative" ref={megaMenuRef}>
            <button
              type="button"
              onClick={() => setMegaMenuOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                megaMenuOpen
                  ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400'
              }`}
              aria-expanded={megaMenuOpen}
            >
              <span>{t('nav.services')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {megaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[680px] luxury-glass rounded-3xl p-6 shadow-luxury-dark border border-gold-500/30 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-royal-750">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-500" />
                      <span className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                        Government Portals & Facilitation Directory
                      </span>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-xs font-bold text-saffron hover:underline flex items-center gap-1"
                    >
                      <span>View All 80+ Portals</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {MEGA_MENU_CATEGORIES.map((cat) => {
                      const IconComp = cat.icon
                      return (
                        <Link
                          key={cat.name}
                          to={cat.to}
                          onClick={() => setMegaMenuOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-2xl hover:bg-gold-500/5 dark:hover:bg-royal-800 border border-transparent hover:border-gold-500/30 transition-all group"
                        >
                          <div className="p-2 rounded-xl bg-gray-50 dark:bg-royal-800 group-hover:scale-105 transition-transform shrink-0">
                            <IconComp className="w-10 h-10" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-saffron transition-colors">
                              {language === 'hi' ? cat.nameHi : cat.name}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                              {cat.desc}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-royal-750 flex items-center justify-between bg-gold-500/5 -mx-6 -mb-6 px-6 py-3">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>100% Cryptographically Attested & Directly Linked</span>
                    </div>
                    <Link
                      to="/wizard"
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Assistance Wizard</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/apply"
            className="px-3 py-1.5 text-xs font-bold text-saffron hover:underline rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Apply Online</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-saffron/15 text-saffron font-extrabold uppercase">
              Fast
            </span>
          </Link>

          <Link
            to="/wizard"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400 rounded-lg transition-colors"
          >
            {t('nav.wizard')}
          </Link>

          <Link
            to="/verify-document"
            className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline rounded-lg transition-colors"
          >
            Verify Certificate
          </Link>

          <Link
            to="/scam-check"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-primary dark:hover:text-gold-400 rounded-lg transition-colors"
          >
            {t('nav.scamCheck')}
          </Link>
        </nav>

        {/* Action Controls & Citizen Auth */}
        <div className="flex items-center gap-2 ml-auto lg:ml-2">
          {isAuthenticated ? (
            <>
              {/* Notification Center */}
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
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 luxury-glass rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700 py-2 z-50">
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

              {/* Citizen User Profile Menu */}
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
                  <div className="absolute right-0 mt-2 w-56 luxury-glass rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700 py-2 z-50 text-xs">
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
                        to="/family-profiles"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-royal-800"
                      >
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>Family Profiles</span>
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
                className="btn-luxury px-3.5 py-1.5 text-xs font-bold shrink-0 shadow-md"
              >
                Register
              </Link>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors border border-gray-200 dark:border-royal-700"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            {language === 'en' ? 'हि' : 'En'}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors border border-gray-200 dark:border-royal-700"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-royal-800 border border-gray-200 dark:border-royal-700"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-royal-900 border-l border-gray-200 dark:border-royal-800 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-royal-800">
                  <Logo size="sm" />
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {isAuthenticated && (
                  <div className="p-3 bg-gold-500/10 rounded-2xl border border-gold-500/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold-500 text-white flex items-center justify-center font-bold text-sm">
                      {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-gray-900 dark:text-white truncate">{user?.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">ID: {user?.registerId}</div>
                    </div>
                  </div>
                )}

                <nav className="space-y-1 text-sm font-semibold">
                  <Link
                    to="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-800 dark:text-gray-200"
                  >
                    🏛️ {t('nav.home')}
                  </Link>
                  <Link
                    to="/services"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-800 dark:text-gray-200"
                  >
                    📋 {t('nav.services')}
                  </Link>
                  <Link
                    to="/apply"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl bg-saffron/10 text-saffron font-bold"
                  >
                    ⚡ Apply Online (Hub)
                  </Link>
                  <Link
                    to="/wizard"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-800 dark:text-gray-200"
                  >
                    🧭 {t('nav.wizard')}
                  </Link>
                  <Link
                    to="/verify-document"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    🛡️ Verify Certificate (QR)
                  </Link>
                  <Link
                    to="/scam-check"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-800 dark:text-gray-200"
                  >
                    🔍 {t('nav.scamCheck')}
                  </Link>
                  <Link
                    to="/design-system"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gold-500 font-bold"
                  >
                    🎨 Design System Spec
                  </Link>

                  {isAuthenticated && (
                    <>
                      <div className="pt-3 pb-1 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                        Citizen Desk
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-700 dark:text-gray-300"
                      >
                        📊 Citizen Dashboard
                      </Link>
                      <Link
                        to="/documents"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-700 dark:text-gray-300"
                      >
                        📂 Digital Document Locker
                      </Link>
                      <Link
                        to="/family-profiles"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-700 dark:text-gray-300"
                      >
                        👨‍👩‍👧 Family Profiles
                      </Link>
                      <Link
                        to="/support"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-700 dark:text-gray-300"
                      >
                        🎧 Citizen Helpdesk
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-royal-800 text-gray-700 dark:text-gray-300"
                      >
                        👤 Profile & Settings
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-royal-800 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full btn-luxury-outline text-xs text-red-600 flex items-center justify-center gap-2 py-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="btn-luxury-outline text-center text-xs py-2.5 font-bold"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="btn-luxury text-center text-xs py-2.5 font-bold"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </header>
  )
}
