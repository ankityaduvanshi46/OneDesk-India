import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SearchBar from './SearchBar'
import { services, CATEGORIES, STATES } from '../data/services'

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const stats = [
    { value: `${services.length}+`, label: t('hero.servicesCount'), icon: '🏛' },
    { value: `${CATEGORIES.length}`, label: t('hero.categoriesCount'), icon: '📂' },
    { value: `${STATES.length}`, label: t('hero.statesCount'), icon: '🇮🇳' }
  ]

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-orange-50/60 via-white to-gray-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-gray-950 border-b border-gray-100 dark:border-gray-800">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-r from-saffron-100/40 via-white/10 to-emerald-100/30 dark:from-orange-950/20 dark:via-transparent dark:to-emerald-950/10 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-saffron-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200 text-xs font-semibold mb-6 shadow-sm"
        >
          <span>🇮🇳</span>
          <span>100% Direct Official Government Portals</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight text-balance"
        >
          {lang === 'hi' ? t('hero.titleHi') : t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 max-w-2xl mx-auto shadow-xl rounded-2xl"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/wizard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>🧭</span>
            <span>{t('hero.wizardCta')}</span>
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-all"
          >
            <span>📋</span>
            <span>{t('hero.cta')}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <div className="text-xl sm:text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
