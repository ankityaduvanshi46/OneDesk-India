import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SearchBar from './SearchBar'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES, STATES } from '../data/services'

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const { getAllServices } = useAppStore()
  const lang = i18n.language

  const totalServices = getAllServices().length

  const stats = [
    { value: `${totalServices}+`, label: t('hero.servicesCount'), icon: '🏛' },
    { value: `${CATEGORIES.length}`, label: t('hero.categoriesCount'), icon: '📂' },
    { value: `${STATES.length}`, label: t('hero.statesCount'), icon: '🇮🇳' }
  ]

  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-20 bg-gradient-to-b from-orange-50/70 via-white to-slate-50 dark:from-royal-850 dark:via-royal-900 dark:to-royal-900 border-b border-gray-100 dark:border-gray-800">
      <div className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,107,53,0.15),rgba(212,175,55,0.08),transparent)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-saffron-300/15 dark:bg-saffron-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold-400/15 dark:bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-royal-800/90 border border-gold-500/30 text-gray-800 dark:text-gold-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md"
        >
          <span className="text-sm">🇮🇳</span>
          <span className="tracking-wide">National Unified Directory • 100% Verified .gov.in Portals</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.15] text-balance"
        >
          {lang === 'hi' ? t('hero.titleHi') : t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 max-w-2xl mx-auto shadow-2xl rounded-2xl relative"
        >
          <SearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            to="/wizard"
            className="btn-luxury flex items-center gap-2 text-sm px-6 py-3"
          >
            <span>🧭</span>
            <span>{t('hero.wizardCta')}</span>
          </Link>
          <Link
            to="/services"
            className="btn-luxury-outline flex items-center gap-2 text-sm px-6 py-3"
          >
            <span>📋</span>
            <span>{t('hero.cta')}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-royal-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gold-500/20 shadow-luxury dark:shadow-luxury-dark hover:border-gold-500/50 transition-all"
            >
              <div className="text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
