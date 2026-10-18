import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { services } from '../data/services'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl, isOfficialDomain, generateShareUrl, generateWhatsAppUrl } from '../utils/helpers'
import { CategoryBadge } from '../components/ServiceCard'
import ServiceCard from '../components/ServiceCard'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite, addRecentlyOpened } = useAppStore()

  const service = services.find((s) => s.id === id)

  const [checkedDocs, setCheckedDocs] = useState({})
  const [showQr, setShowQr] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl">🏛</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Not Found</h1>
        <p className="text-gray-500">The government service you are looking for does not exist in our directory.</p>
        <Link to="/services" className="btn-primary inline-block">Browse All Services</Link>
      </div>
    )
  }

  const lang = i18n.language
  const isFav = isFavourite(service.id)
  const serviceName = lang === 'hi' && service.nameHi ? service.nameHi : service.name
  const serviceDesc = lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description

  const relatedServices = (service.related || [])
    .map((relId) => services.find((s) => s.id === relId))
    .filter(Boolean)

  const toggleDocCheck = (doc) => {
    setCheckedDocs((prev) => ({ ...prev, [doc]: !prev[doc] }))
  }

  const handleFavourite = () => {
    const added = toggleFavourite(service.id)
    if (added) {
      toast.success(lang === 'hi' ? 'पसंदीदा में जोड़ा!' : 'Added to favourites!', { icon: '❤️' })
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
    } else {
      toast(lang === 'hi' ? 'पसंदीदा से हटाया' : 'Removed from favourites', { icon: '💔' })
    }
  }

  const handleOpenOfficial = () => {
    addRecentlyOpened(service.id)
    if (!isValidUrl(service.url) || !isOfficialDomain(service.url)) {
      toast.error('This link could not be verified as an official domain.')
      return
    }
    window.open(service.url, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = async () => {
    const url = generateShareUrl(service.id)
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t('detail.linkCopied'))
    } catch {
      toast.error('Could not copy link')
    }
  }

  const handleWhatsApp = () => {
    const text = `Direct official portal for ${service.name}: ${generateShareUrl(service.id)}`
    window.open(generateWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateShareUrl(service.id))}`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Helmet>
        <title>{serviceName} – Official Portal, Documents & How to Apply | {t('siteName')}</title>
        <meta name="description" content={`Official website, required documents checklist, fees, processing time, and step-by-step application guide for ${serviceName}.`} />
      </Helmet>

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-brand-primary">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-brand-primary">Services</Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{serviceName}</span>
      </nav>

      <header className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 relative">
              {service.logo && !imgError ? (
                <img
                  src={service.logo}
                  alt=""
                  onError={() => setImgError(true)}
                  className="w-16 h-16 rounded-2xl object-contain bg-gray-50 dark:bg-gray-800 p-2 border border-gray-100 dark:border-gray-700"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-sm"
                  style={{ backgroundColor: service.logoColor || '#FF6B35' }}
                >
                  {service.logoFallback || service.name.charAt(0)}
                </div>
              )}
              {service.verified && (
                <span
                  className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 text-[10px] shadow"
                  title={t('serviceCard.verified')}
                >
                  ✓
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {serviceName}
                </h1>
                {service.state && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                    {service.state}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {serviceDesc}
              </p>
              <div className="pt-2">
                <CategoryBadge category={service.category} />
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={handleFavourite}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isFav
                  ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{isFav ? '❤️' : '🤍'}</span>
              <span>{isFav ? t('serviceCard.removeFavourite') : t('serviceCard.addFavourite')}</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
                title={t('detail.copyLink')}
              >
                🔗
              </button>
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
                title={t('detail.whatsapp')}
              >
                💬
              </button>
              <button
                onClick={() => setShowQr((v) => !v)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs"
                title={t('detail.qrCode')}
              >
                📱
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-800/50">
            <span>🛡️</span>
            <span>Verified official domain: <code className="font-mono">{new URL(service.url).hostname}</code></span>
          </div>

          <button
            onClick={handleOpenOfficial}
            className="w-full sm:w-auto btn-primary px-8 py-3 text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <span>{t('serviceCard.openWebsite')}</span>
            <span>↗</span>
          </button>
        </div>

        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center text-center space-y-2"
            >
              <p className="text-xs text-gray-500">Scan QR Code to open on phone</p>
              <img src={qrUrl} alt="QR Code" className="w-40 h-40 rounded-xl shadow-md border" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="text-xl mb-1">💰</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('serviceCard.fees')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{service.fees || 'Free'}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="text-xl mb-1">⏱️</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('serviceCard.time')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{service.time || 'Immediate'}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
          <div className="text-xl mb-1">📞</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('serviceCard.helpline')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
            {service.helpline ? (
              <a href={`tel:${service.helpline}`} className="text-brand-primary hover:underline">{service.helpline}</a>
            ) : '1800-11-0001'}
          </div>
        </div>
      </div>

      {service.documents && service.documents.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📄</span>
              <span>{t('detail.documentsRequired')} Checklist</span>
            </h2>
            <span className="text-xs text-gray-400">
              {Object.values(checkedDocs).filter(Boolean).length} / {service.documents.length} ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.documents.map((doc, i) => {
              const isChecked = !!checkedDocs[doc]
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDocCheck(doc)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-green-600 text-white'
                        : 'border-2 border-gray-400 dark:border-gray-500'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                  <span className={`text-sm ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {doc}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {service.steps && service.steps.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🪜</span>
            <span>{t('detail.howToApply')}</span>
          </h2>
          <ol className="space-y-4">
            {service.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/50 text-brand-primary dark:text-orange-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔗</span>
            <span>{t('detail.relatedServices')}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedServices.map((rel, index) => (
              <ServiceCard key={rel.id} service={rel} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
