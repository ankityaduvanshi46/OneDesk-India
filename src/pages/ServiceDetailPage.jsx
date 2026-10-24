import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  ArrowRight,
  Heart,
  QrCode,
  FileText,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ChevronDown
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { isValidUrl, isOfficialDomain, generateShareUrl, generateWhatsAppUrl } from '../utils/helpers'
import { CategoryBadge } from '../components/ServiceCard'
import ServiceCard from '../components/ServiceCard'
import ServiceIllustration from '../components/design-system/ServiceIllustrations'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite, addRecentlyOpened, getAllServices } = useAppStore()

  const allServices = getAllServices()
  const service = allServices.find((s) => s.id === id)

  const [checkedDocs, setCheckedDocs] = useState({})
  const [showQr, setShowQr] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl">🏛️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Not Found</h1>
        <p className="text-gray-500">The government service you are looking for does not exist in our directory.</p>
        <Link to="/services" className="btn-luxury inline-block">
          Browse All Services
        </Link>
      </div>
    )
  }

  const lang = i18n.language
  const isFav = isFavourite(service.id)
  const serviceName = lang === 'hi' && service.nameHi ? service.nameHi : service.name
  const serviceDesc = lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description

  const relatedServices = (service.related || [])
    .map((relId) => allServices.find((s) => s.id === relId))
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-28 sm:pb-8">
      <Helmet>
        <title>{serviceName} – Official Portal, Checklist & Application Guide | {t('siteName')}</title>
        <meta
          name="description"
          content={`Official website, required documents checklist, fees, processing time, and step-by-step application guide for ${serviceName}.`}
        />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-saffron">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-saffron">Services</Link>
        <span>/</span>
        <span className="text-gray-800 dark:text-gray-200 font-semibold truncate">{serviceName}</span>
      </nav>

      {/* Hero Header Card */}
      <header className="luxury-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-gray-100 dark:border-royal-750 shadow-luxury">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 relative">
              {service.logo && !imgError ? (
                <img
                  src={service.logo}
                  alt=""
                  onError={() => setImgError(true)}
                  className="w-16 h-16 rounded-2xl object-contain bg-gray-50 dark:bg-royal-800 p-2 border border-gray-100 dark:border-gray-700 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-royal-800 p-1 flex items-center justify-center border border-gold-500/30">
                  <ServiceIllustration category={service.category} className="w-12 h-12" />
                </div>
              )}
              {service.verified && (
                <span
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 text-[10px] shadow"
                  title={t('serviceCard.verified')}
                >
                  ✓
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {serviceName}
                </h1>
                {service.state && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/50">
                    {service.state}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {serviceDesc}
              </p>
              <div className="pt-1">
                <CategoryBadge category={service.category} />
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={handleFavourite}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isFav
                  ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40 dark:border-red-800'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-royal-750'
              }`}
            >
              <span>{isFav ? '❤️' : '🤍'}</span>
              <span>{isFav ? t('serviceCard.removeFavourite') : t('serviceCard.addFavourite')}</span>
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-royal-750 text-xs"
                title={t('detail.copyLink')}
              >
                🔗
              </button>
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-royal-750 text-xs text-emerald-600"
                title={t('detail.whatsapp')}
              >
                💬
              </button>
              <button
                onClick={() => setShowQr((v) => !v)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-royal-750 text-xs"
                title={t('detail.qrCode')}
              >
                📱
              </button>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="pt-4 border-t border-gray-100 dark:border-royal-750 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verified Official Portal: <code className="font-mono font-bold">{(() => { try { return new URL(service.url).hostname } catch { return service.url || 'gov.in' } })()}</code></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-col sm:flex-row">
            <Link
              to={`/apply?service=${service.id}`}
              className="w-full sm:w-auto btn-luxury px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>⚡ Apply via OneDesk Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleOpenOfficial}
              className="w-full sm:w-auto btn-luxury-outline px-6 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>{t('serviceCard.openWebsite')}</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-gray-100 dark:border-royal-750 flex flex-col items-center text-center space-y-2"
            >
              <p className="text-xs text-gray-500">Scan QR Code to share service directly</p>
              <img src={qrUrl} alt="QR Code" className="w-40 h-40 rounded-xl shadow-md border p-1 bg-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="luxury-glass rounded-2xl p-5 border border-gray-100 dark:border-royal-750">
          <div className="text-xl mb-1">💰</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">{t('serviceCard.fees')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{service.fees || 'Govt Free'}</div>
          <div className="text-[10px] text-gray-400 mt-1">Official state fee schedule</div>
        </div>

        <div className="luxury-glass rounded-2xl p-5 border border-gray-100 dark:border-royal-750">
          <div className="text-xl mb-1">⏱️</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">{t('serviceCard.time')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{service.time || 'Immediate'}</div>
          <div className="text-[10px] text-emerald-500 mt-1">Statutory citizen charter SLA</div>
        </div>

        <div className="luxury-glass rounded-2xl p-5 border border-gray-100 dark:border-royal-750">
          <div className="text-xl mb-1">📞</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">{t('serviceCard.helpline')}</div>
          <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
            {service.helpline ? (
              <a href={`tel:${service.helpline}`} className="text-saffron hover:underline">
                {service.helpline}
              </a>
            ) : (
              '1800-11-0001'
            )}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Toll-free citizen helpdesk</div>
        </div>
      </div>

      {/* Interactive Required Documents Checklist */}
      {service.documents && service.documents.length > 0 && (
        <section className="luxury-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-100 dark:border-royal-750">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-500" />
                <span>{t('detail.documentsRequired')} Checklist</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Tick each item to verify you have scanned copies ready</p>
            </div>
            <span className="text-xs font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
              {Object.values(checkedDocs).filter(Boolean).length} / {service.documents.length} ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {service.documents.map((doc, i) => {
              const isChecked = !!checkedDocs[doc]
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDocCheck(doc)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    isChecked
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-royal-800/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-750'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isChecked ? 'bg-emerald-600 text-white' : 'border-2 border-gray-400 dark:border-gray-500'
                    }`}
                  >
                    {isChecked ? '✓' : ''}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through opacity-75' : ''}`}>
                    {doc}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Step by Step Timeline Guide */}
      {service.steps && service.steps.length > 0 && (
        <section className="luxury-glass rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-100 dark:border-royal-750">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🪜</span>
            <span>Step-by-Step Official Procedure</span>
          </h2>
          <ol className="space-y-4 pt-2">
            {service.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="w-7 h-7 rounded-full bg-saffron/15 text-saffron font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-saffron/30">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Related Services */}
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

      {/* Sticky Bottom Apply Action Bar for Mobile Viewports */}
      <div className="fixed bottom-16 inset-x-0 sm:hidden z-40 bg-white/95 dark:bg-royal-900/95 backdrop-blur-md p-3 border-t border-gray-200 dark:border-royal-800 flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0">
          <span className="text-[10px] text-gray-400 block truncate">{serviceName}</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">{service.fees || 'Govt Free'}</span>
        </div>
        <Link
          to={`/apply?service=${service.id}`}
          className="btn-luxury px-5 py-2.5 text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
