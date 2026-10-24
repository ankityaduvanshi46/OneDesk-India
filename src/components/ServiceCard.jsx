import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Heart,
  Share2,
  Clock,
  Phone,
  CheckCircle2,
  CreditCard,
  Car,
  FileCheck,
  Receipt,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Building,
  Zap,
  HelpCircle
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl, isOfficialDomain } from '../utils/helpers'
import { trackOfficialPortalClick } from '../utils/analytics'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  identity: CreditCard,
  transport: Car,
  certificates: FileCheck,
  'tax-finance': Receipt,
  taxes: Receipt,
  education: GraduationCap,
  health: HeartPulse,
  jobs: Briefcase,
  employment: Briefcase,
  'land-property': Building,
  agriculture: Building,
  utilities: Zap,
  grievance: HelpCircle
}

const CATEGORY_COLORS = {
  identity: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/60 dark:border-blue-800/40',
    gradient: 'from-blue-500 to-indigo-600'
  },
  transport: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
    gradient: 'from-emerald-500 to-teal-600'
  },
  certificates: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    gradient: 'from-amber-500 to-orange-600'
  },
  'tax-finance': {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200/60 dark:border-purple-800/40',
    gradient: 'from-purple-500 to-indigo-600'
  },
  taxes: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200/60 dark:border-purple-800/40',
    gradient: 'from-purple-500 to-indigo-600'
  },
  education: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-400',
    border: 'border-cyan-200/60 dark:border-cyan-800/40',
    gradient: 'from-cyan-500 to-blue-600'
  },
  health: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200/60 dark:border-rose-800/40',
    gradient: 'from-rose-500 to-pink-600'
  },
  jobs: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    gradient: 'from-slate-600 to-slate-800'
  },
  employment: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    gradient: 'from-slate-600 to-slate-800'
  },
  'land-property': {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200/60 dark:border-teal-800/40',
    gradient: 'from-teal-500 to-emerald-600'
  },
  agriculture: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200/60 dark:border-teal-800/40',
    gradient: 'from-teal-500 to-emerald-600'
  },
  utilities: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    gradient: 'from-amber-500 to-yellow-600'
  },
  grievance: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200/60 dark:border-orange-800/40',
    gradient: 'from-orange-500 to-red-600'
  }
}

function getCleanDomain(url) {
  if (!url) return 'gov.in'
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return host
  } catch {
    return 'gov.in'
  }
}

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
      toast.success(lang === 'hi' ? 'पसंदीदा में जोड़ा गया' : 'Saved to favorites', { icon: '❤️' })
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } })
    } else {
      toast(lang === 'hi' ? 'पसंदीदा से हटाया गया' : 'Removed from favorites', { icon: '💔' })
    }
  }

  const handleOpenExternal = (e) => {
    e.stopPropagation()
    addRecentlyOpened(service.id)
    trackOfficialPortalClick(service.id, service.url)
    if (!isValidUrl(service.url) || !isOfficialDomain(service.url)) {
      toast.error('Could not verify official government domain for this portal.')
      return
    }
    window.open(service.url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = (e) => {
    e.stopPropagation()
    setShowShareMenu((v) => !v)
  }

  const handleCopyLink = async (e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/services/${service.id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('detail.linkCopied') || 'Link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
    setShowShareMenu(false)
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation()
    const text = `Access ${service.name} on OneDesk India: ${window.location.origin}/services/${service.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  const serviceName = lang === 'hi' && service.nameHi ? service.nameHi : service.name
  const serviceDesc = lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description
  const categoryConfig = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.identity
  const IconComponent = CATEGORY_ICONS[service.category] || ShieldCheck
  const domain = getCleanDomain(service.url)

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.25) }}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      onClick={() => navigate(`/services/${service.id}`)}
      className="group relative bg-white dark:bg-royal-850 rounded-2xl p-5 border border-slate-200/90 dark:border-royal-750 shadow-sm hover:shadow-xl hover:border-gold-500/50 dark:hover:border-gold-500/40 transition-all cursor-pointer flex flex-col justify-between"
      aria-label={`${serviceName} – ${serviceDesc}`}
    >
      <div>
        {/* Top Header: Category Icon + Domain + Actions */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Category Icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${categoryConfig.border} ${categoryConfig.bg} transition-transform group-hover:scale-105`}>
              {service.logo && !imgError ? (
                <img
                  src={service.logo}
                  alt={`${serviceName} portal logo`}
                  onError={() => setImgError(true)}
                  className="w-8 h-8 object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <IconComponent className={`w-5 h-5 ${categoryConfig.text}`} />
              )}
            </div>

            {/* Authority / Domain Info */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {domain}
                </span>
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400" title="Verified Official Portal">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                {service.state ? service.state : (lang === 'hi' ? 'केंद्रीय पोर्टल' : 'National Portal')}
              </span>
            </div>
          </div>

          {/* Action Icons: Favorite & Share */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleFavourite}
              className={`p-1.5 rounded-lg transition-colors ${
                isFav
                  ? 'text-red-500 bg-red-50 dark:bg-red-950/40'
                  : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-royal-800'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-royal-800 transition-colors"
                title="Share service"
                aria-label="Share service"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 top-9 bg-white dark:bg-royal-800 rounded-xl shadow-xl border border-slate-200 dark:border-royal-700 py-1.5 z-20 w-44"
                  >
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-royal-700 flex items-center gap-2"
                    >
                      <span>🔗</span>
                      <span>{t('detail.copyLink') || 'Copy Link'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-royal-700 flex items-center gap-2"
                    >
                      <span>💬</span>
                      <span>{t('detail.whatsapp') || 'Share via WhatsApp'}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Title without ugly truncation */}
        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-saffron transition-colors mb-1.5">
          {serviceName}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {serviceDesc}
        </p>
      </div>

      <div>
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-royal-750 mb-3 text-xs">
          <CategoryBadge category={service.category} />

          {service.helpline && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                window.location.href = `tel:${service.helpline}`
              }}
              className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-amber-600 flex items-center gap-1"
              title={`Helpline: ${service.helpline}`}
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{service.helpline}</span>
            </span>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/services/${service.id}`)
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-royal-750 dark:hover:bg-royal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all group-hover:bg-saffron dark:group-hover:bg-saffron"
          >
            <span>{t('serviceCard.viewDetails') || 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenExternal}
            className="p-2 rounded-xl border border-slate-200 dark:border-royal-700 text-slate-600 dark:text-slate-300 hover:text-saffron hover:border-saffron/40 dark:hover:text-gold-400 transition-colors"
            title={`Open official portal: ${domain}`}
            aria-label={`Open official portal: ${service.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function CategoryBadge({ category }) {
  const CATEGORY_CONFIG = {
    identity: { label: 'Identity', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60', icon: '🪪' },
    transport: { label: 'Transport', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60', icon: '🚗' },
    certificates: { label: 'Certificates', color: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60', icon: '📜' },
    'tax-finance': { label: 'Tax & Finance', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/60', icon: '💰' },
    taxes: { label: 'Tax & Finance', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/60', icon: '💰' },
    education: { label: 'Education', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200/60', icon: '🎓' },
    health: { label: 'Healthcare', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60', icon: '🏥' },
    jobs: { label: 'Jobs & Labor', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60', icon: '💼' },
    employment: { label: 'Jobs & Labor', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60', icon: '💼' },
    'land-property': { label: 'Land & Property', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200/60', icon: '🏠' },
    agriculture: { label: 'Land & Agriculture', color: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200/60', icon: '🌾' },
    utilities: { label: 'Utilities', color: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200/60', icon: '⚡' },
    grievance: { label: 'Grievance', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/60', icon: '📢' }
  }
  const config = CATEGORY_CONFIG[category] || { label: category || 'General', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '📌' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.color}`}>
      <span aria-hidden="true">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
