import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { STATES } from '../data/services'

export default function SettingsPanel({ onClose }) {
  const { t, i18n } = useTranslation()
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    selectedState,
    setSelectedState
  } = useAppStore()

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Settings">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-sm bg-white dark:bg-gray-900 h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>⚙️</span>
              <span>{t('settings.theme')} & {t('settings.language')}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t('settings.language')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                  language === 'en'
                    ? 'border-brand-primary bg-orange-50 text-brand-primary dark:bg-orange-950/40 dark:border-orange-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all font-hindi ${
                  language === 'hi'
                    ? 'border-brand-primary bg-orange-50 text-brand-primary dark:bg-orange-950/40 dark:border-orange-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t('settings.theme')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'border-brand-primary bg-orange-50 text-brand-primary'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span>☀️</span> {t('settings.light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'border-orange-500 bg-orange-950/40 text-orange-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span>🌙</span> {t('settings.dark')}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t('settings.fontSize')}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'sm', label: 'A-', title: 'Small' },
                { id: 'md', label: 'A', title: 'Normal' },
                { id: 'lg', label: 'A+', title: 'Large' },
                { id: 'xl', label: 'A++', title: 'Extra Large' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setFontSize(s.id)}
                  title={s.title}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    fontSize === s.id
                      ? 'border-brand-primary bg-orange-50 text-brand-primary dark:bg-orange-950/40'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
              {t('settings.state')}
            </label>
            <select
              value={selectedState || ''}
              onChange={(e) => setSelectedState(e.target.value || null)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              <option value="">All India (National Portals)</option>
              {STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            OneDesk India v1.0.0 • No Personal Data Collected
          </p>
        </div>
      </motion.div>
    </div>
  )
}
