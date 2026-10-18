import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl, isOfficialDomain } from '../utils/helpers'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

export default function ServiceCard({ service, index = 0 }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite, addRecentlyOpened, addQuickLink } = useAppStore()
  const [imgError, setImgError] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const isFav = isFavourite(service.id)
  const lang = i18n.language

  const handleFavourite = (e) => {
    e.stopPropagation()
    const added = toggleFavourite(service.id)
    if (added) {
      toast.success(lang === 'hi' ? 'पसंदीदा में जोड़ा!' : 'Added to favourites!', { icon: '❤️' })
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#FF6B35', '#138808', '#FF9933'] })
    } else {
      toast(lang === 'hi' ? 'पसंदीदा से हटाया' : 'Removed from favourites', { icon: '💔' })
    }
  }

  const handleOpen = () => {
    addRecentlyOpened(service.id)
    if (!isValidUrl(service.url) || !isOfficialDomain(service.url)) {
      toast.error('This link could not be verified as an official domain.')
      return
    }
    window.open(service.url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = (e) => {
    e.stopPropagation()
    setShowShareMenu((v) => !v)
  }

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/service/${service.id}`
    try { await navigator.clipboard.writeText(url); toast.success(t('detail.linkCopied')) } catch { toast.error('Failed to copy') }
    setShowShareMenu(false)
  }

  const handleWhatsApp = () => {
    const text = `Check out ${service.name} on Sarkari Seva Hub: ${window.location.origin}/service/${service.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  const serviceName = lang === 'hi' && service.nameHi ? service.nameHi : service.name
  const serviceDesc = lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="service-card group relative"
      aria-label={`${serviceName} – ${serviceDesc}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="shrink-0 relative">
            {service.logo && !imgError ? (
              <img
                src={service.logo}
                alt=""
                onError={() => setImgError(true)}
                className="w-12 h-12 rounded-xl object-contain bg-gray-100 dark:bg-gray-800 p-1"
                aria-hidden="true"
                loading="lazy"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: service.logoColor || '#FF6B35' }}
                aria-hidden="true"
              >
                {service.logoFallback || service.name.charAt(0)}
              </div>
            )}
            {service.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center" title={t('serviceCard.verified')}>
                <span className="text-white text-[8px]">✓</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight line-clamp-1">{serviceName}</h3>
            {service.state && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{service.state}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavourite}
            className={`p-1.5 rounded-lg transition-all ${isFav ? 'text-red-500' : 'text-gray-300 dark:text-gray-600 hover:text-red-400'}`}
            aria-label={isFav ? t('serviceCard.removeFavourite') : t('serviceCard.addFavourite')}
            aria-pressed={isFav}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-brand-primary transition-all"
              aria-label={t('serviceCard.share')}
            >
              📤
            </button>
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-20 w-44"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={handleCopyLink} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    🔗 {t('detail.copyLink')}
                  </button>
                  <button onClick={handleWhatsApp} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                    💬 {t('detail.whatsapp')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
        {serviceDesc}
      </p>

      <div className="flex items-center justify-between gap-2">
        <CategoryBadge category={service.category} />
        {service.helpline && (
          <a
            href={`tel:${service.helpline}`}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-primary transition-colors"
            aria-label={`Helpline: ${service.helpline}`}
            onClick={(e) => e.stopPropagation()}
          >
            📞 {service.helpline}
          </a>
        )}
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => navigate(`/service/${service.id}`)}
          className="flex-1 btn-secondary text-xs py-2"
        >
          {t('serviceCard.viewDetails')}
        </button>
        <button
          onClick={handleOpen}
          className="flex-1 btn-primary text-xs py-2"
          aria-label={`${t('serviceCard.openWebsite')}: ${service.name}`}
        >
          {t('serviceCard.openWebsite')} ↗
        </button>
      </div>
    </motion.article>
  )
}

export function CategoryBadge({ category }) {
  const CATEGORY_CONFIG = {
    identity: { label: 'Identity', labelHi: 'पहचान', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', icon: '🪪' },
    transport: { label: 'Transport', labelHi: 'परिवहन', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', icon: '🚗' },
    certificates: { label: 'Certificates', labelHi: 'प्रमाण पत्र', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300', icon: '📜' },
    'tax-finance': { label: 'Tax & Finance', labelHi: 'कर और वित्त', color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300', icon: '💰' },
    education: { label: 'Education', labelHi: 'शिक्षा', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300', icon: '🎓' },
    health: { label: 'Health', labelHi: 'स्वास्थ्य', color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', icon: '🏥' },
    jobs: { label: 'Jobs', labelHi: 'नौकरी', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300', icon: '💼' },
    'land-property': { label: 'Land & Property', labelHi: 'जमीन', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300', icon: '🏠' },
    utilities: { label: 'Utilities', labelHi: 'सुविधाएं', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300', icon: '⚡' },
    grievance: { label: 'Grievance', labelHi: 'शिकायत', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: '📢' }
  }
  const config = CATEGORY_CONFIG[category] || { label: category, color: 'bg-gray-100 text-gray-700', icon: '📌' }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  )
}
