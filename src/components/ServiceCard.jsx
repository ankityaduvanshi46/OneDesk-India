import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl, isOfficialDomain } from '../utils/helpers'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

export default function ServiceCard({ service, index = 0 }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite, addRecentlyOpened } = useAppStore()
  const [imgError, setImgError] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const isFav = isFavourite(service.id)
  const lang = i18n.language

  const handleFavourite = (e) => {
    e.stopPropagation()
    const added = toggleFavourite(service.id)
    if (added) {
      toast.success(lang === 'hi' ? 'पसंदीदा में जोड़ा!' : 'Added to favourites!', { icon: '❤️' })
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#D4AF37', '#FF6B35', '#138808'] })
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
    const text = `Check out ${service.name} on OneDesk India: ${window.location.origin}/service/${service.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  const serviceName = lang === 'hi' && service.nameHi ? service.nameHi : service.name
  const serviceDesc = lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="luxury-card group relative bg-white dark:bg-royal-800/90 border border-gray-100 dark:border-gray-700/60 hover:border-gold-500/40 dark:hover:border-gold-500/50 shadow-card hover:shadow-card-hover"
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
                className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-royal-700 p-1 border border-gray-100 dark:border-gray-700"
                aria-hidden="true"
                loading="lazy"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm border border-white/20"
                style={{ backgroundColor: service.logoColor || '#FF6B35' }}
                aria-hidden="true"
              >
                {service.logoFallback || service.name.charAt(0)}
              </div>
            )}
            {service.verified && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border border-white dark:border-royal-800 rounded-full w-4 h-4 flex items-center justify-center shadow" title={t('serviceCard.verified')}>
                <span className="text-white text-[8px] font-bold">✓</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
              {serviceName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {service.state ? (
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{service.state}</span>
              ) : (
                <span className="text-[11px] text-gray-400 dark:text-gray-400 font-medium">National Portal</span>
              )}
              {service.isUserAdded && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gold-100 dark:bg-gold-950/40 text-gold-700 dark:text-gold-300 font-semibold">
                  Custom
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavourite}
            className={`p-1.5 rounded-lg transition-all ${isFav ? 'text-red-500 scale-110' : 'text-gray-300 dark:text-gray-600 hover:text-red-400'}`}
            aria-label={isFav ? t('serviceCard.removeFavourite') : t('serviceCard.addFavourite')}
            aria-pressed={isFav}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-brand-primary transition-all"
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
                  className="absolute right-0 top-8 bg-white dark:bg-royal-850 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 z-20 w-44"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={handleCopyLink} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-royal-700 flex items-center gap-2">
                    🔗 {t('detail.copyLink')}
                  </button>
                  <button onClick={handleWhatsApp} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-royal-700 flex items-center gap-2">
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

      <div className="flex items-center justify-between gap-2 pt-1">
        <CategoryBadge category={service.category} />
        {service.helpline && (
          <a
            href={`tel:${service.helpline}`}
            className="text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-1"
            aria-label={`Helpline: ${service.helpline}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>📞</span>
            <span>{service.helpline}</span>
          </a>
        )}
      </div>

      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50 dark:border-gray-700/50">
        <button
          onClick={() => navigate(`/service/${service.id}`)}
          className="flex-1 btn-luxury-outline text-xs py-2 px-2 text-center"
        >
          {t('serviceCard.viewDetails')}
        </button>
        <button
          onClick={handleOpen}
          className="flex-1 btn-luxury text-xs py-2 px-2 text-center flex items-center justify-center gap-1"
          aria-label={`${t('serviceCard.openWebsite')}: ${service.name}`}
        >
          <span>Open</span>
          <span>↗</span>
        </button>
      </div>
    </motion.article>
  )
}

export function CategoryBadge({ category }) {
  const CATEGORY_CONFIG = {
    identity: { label: 'Identity', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50', icon: '🪪' },
    transport: { label: 'Transport', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/50', icon: '🚗' },
    certificates: { label: 'Certificates', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50', icon: '📜' },
    'tax-finance': { label: 'Tax & Finance', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50', icon: '💰' },
    education: { label: 'Education', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/50', icon: '🎓' },
    health: { label: 'Health', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50', icon: '🏥' },
    jobs: { label: 'Jobs', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/50', icon: '💼' },
    'land-property': { label: 'Land', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200/50', icon: '🏠' },
    utilities: { label: 'Utilities', color: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200/50', icon: '⚡' },
    grievance: { label: 'Grievance', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/50', icon: '📢' }
  }
  const config = CATEGORY_CONFIG[category] || { label: category, color: 'bg-gray-100 text-gray-700', icon: '📌' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.color}`}>
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
