import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAppStore } from '../store/useAppStore'
import { services } from '../data/services'
import ServiceCard from '../components/ServiceCard'

export default function FavouritesPage() {
  const { t } = useTranslation()
  const { favourites } = useAppStore()

  const favouriteServices = favourites
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Helmet>
        <title>{t('favourites.title')} – {t('siteName')}</title>
        <meta name="description" content="Your saved favourite Indian government services for quick access." />
      </Helmet>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <span>❤️</span>
          <span>{t('favourites.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Saved locally on your device. No login or personal data required.
        </p>
      </div>

      {favouriteServices.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {favouriteServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 max-w-md mx-auto space-y-4 shadow-sm">
          <div className="text-5xl" aria-hidden="true">🤍</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('favourites.empty')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('favourites.emptyHint')}
          </p>
          <div className="pt-2">
            <Link to="/services" className="btn-primary text-sm inline-block px-6 py-2.5">
              Browse Services
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
