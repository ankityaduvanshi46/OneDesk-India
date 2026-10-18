import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useAppStore } from '../store/useAppStore'
import { services } from '../data/services'
import { isValidUrl, isOfficialDomain } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function QuickLinksPage() {
  const { t } = useTranslation()
  const { quickLinks, addQuickLink, removeQuickLink, reorderQuickLinks, addRecentlyOpened } = useAppStore()
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState('')

  const activeQuickLinks = quickLinks
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean)

  const availableToAdd = services.filter((s) => !quickLinks.includes(s.id))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!selectedServiceToAdd) return
    addQuickLink(selectedServiceToAdd)
    toast.success('Added to Quick Links!')
    setSelectedServiceToAdd('')
  }

  const handleMove = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= quickLinks.length) return
    const updated = [...quickLinks]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    reorderQuickLinks(updated)
  }

  const handleOpen = (service) => {
    addRecentlyOpened(service.id)
    if (!isValidUrl(service.url) || !isOfficialDomain(service.url)) {
      toast.error('Unverified domain.')
      return
    }
    window.open(service.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Helmet>
        <title>{t('quickLinks.title')} – {t('siteName')}</title>
        <meta name="description" content="Customizable Quick Links dashboard for instant access to your most-used government portals." />
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚡</span>
            <span>{t('quickLinks.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pin and reorder your essential portals for 1-click access.
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <select
            value={selectedServiceToAdd}
            onChange={(e) => setSelectedServiceToAdd(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 max-w-xs truncate focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            <option value="">+ Add a portal...</option>
            {availableToAdd.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedServiceToAdd}
            className="btn-primary text-xs py-2 px-3 shrink-0 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </div>

      {activeQuickLinks.length > 0 ? (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Your Pinned Portals ({activeQuickLinks.length})</span>
            <span>Reorder / Manage</span>
          </div>

          <AnimatePresence mode="popLayout">
            {activeQuickLinks.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div
                  onClick={() => handleOpen(service)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                    style={{ backgroundColor: service.logoColor || '#FF6B35' }}
                  >
                    {service.logoFallback || service.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 dark:text-white truncate flex items-center gap-2">
                      <span>{service.name}</span>
                      {service.verified && <span className="text-green-500 text-xs">✓</span>}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {new URL(service.url).hostname}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleMove(index, 1)}
                    disabled={index === activeQuickLinks.length - 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-20 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
                    title="Move down"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => handleOpen(service)}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 ml-1"
                  >
                    <span>Open</span>
                    <span>↗</span>
                  </button>
                  <button
                    onClick={() => removeQuickLink(service.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs ml-1"
                    title="Remove from quick links"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 max-w-md mx-auto space-y-4 shadow-sm">
          <div className="text-5xl">⚡</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('quickLinks.empty')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('quickLinks.emptyHint')}
          </p>
          <div className="pt-2">
            <Link to="/services" className="btn-primary text-sm inline-block px-6 py-2.5">
              Explore Services
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
