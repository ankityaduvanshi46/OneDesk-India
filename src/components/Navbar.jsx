import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import SearchBar from './SearchBar'
import SettingsPanel from './SettingsPanel'
import Logo from './Logo'

export default function Navbar() {
  const { t } = useTranslation()
  const { theme, toggleTheme, language, toggleLanguage } = useAppStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm'
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

        <div className="flex-1 max-w-lg mx-2 hidden sm:block">
          <SearchBar compact />
        </div>

        <nav className="hidden lg:flex items-center gap-1 ml-auto" aria-label="Main navigation">
          <Link to="/services" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary rounded-lg transition-colors">
            {t('nav.services')}
          </Link>
          <Link to="/wizard" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary rounded-lg transition-colors">
            {t('nav.wizard')}
          </Link>
          <Link to="/scam-check" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary rounded-lg transition-colors">
            {t('nav.scamCheck')}
          </Link>
          <Link to="/quick-links" className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary rounded-lg transition-colors">
            {t('nav.quickLinks')}
          </Link>
        </nav>

        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
            aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          >
            {language === 'en' ? 'हि' : 'En'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-800"
            aria-label="Open settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="px-4 pb-3 sm:hidden">
        <SearchBar compact />
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsPanel onClose={() => setSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  )
}
