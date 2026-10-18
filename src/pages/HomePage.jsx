import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/HeroSection'
import CategoryChips from '../components/CategoryChips'
import StateSelector from '../components/StateSelector'
import ServiceCard from '../components/ServiceCard'
import AddServiceModal from '../components/AddServiceModal'
import { TRENDING_SERVICES } from '../data/services'
import { useAppStore } from '../store/useAppStore'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { selectedState, getAllServices } = useAppStore()
  const [activeCategory, setActiveCategory] = useState('all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const allServices = getAllServices()

  const trendingServices = useMemo(() => {
    return TRENDING_SERVICES.map((id) => allServices.find((s) => s.id === id)).filter(Boolean)
  }, [allServices])

  const filteredServices = useMemo(() => {
    let list = [...allServices]
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory)
    }
    if (selectedState) {
      list.sort((a, b) => {
        if (a.state === selectedState && b.state !== selectedState) return -1
        if (b.state === selectedState && a.state !== selectedState) return 1
        return 0
      })
    }
    return list
  }, [allServices, activeCategory, selectedState])

  return (
    <div>
      <Helmet>
        <title>{t('siteName')} – Official Indian Government Direct Services Directory</title>
        <meta name="description" content="OneDesk India: Luxury single-window directory of direct links to 80+ official Indian government service portals. Instant auto-sync and verified official domains." />
      </Helmet>

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <section aria-labelledby="trending-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <h2 id="trending-heading" className="text-lg font-bold text-gray-900 dark:text-white">
                {t('search.trending')}
              </h2>
            </div>
            <Link to="/services" className="text-xs font-semibold text-brand-primary hover:underline">
              {t('hero.cta')} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingServices.slice(0, 5).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </section>

        <section aria-labelledby="directory-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 id="directory-heading" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🏛</span>
                <span>{t('categories.all')}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {filteredServices.length} {t('search.results')} • Auto-Updated
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn-luxury-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Auto-Add Portal</span>
              </button>
              <StateSelector />
            </div>
          </div>

          <CategoryChips activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="bg-gradient-to-r from-royal-850 via-royal-800 to-royal-850 rounded-3xl p-6 sm:p-10 text-white shadow-luxury-dark relative overflow-hidden border border-gold-500/25">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_right,rgba(212,175,55,0.15),transparent)] pointer-events-none" />
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold backdrop-blur-sm border border-gold-500/30">
              <span>🧭</span>
              <span>Intelligent Guided Wizard</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
              {t('wizard.title')}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {t('wizard.subtitle')}
            </p>
            <div className="pt-2">
              <Link
                to="/wizard"
                className="btn-luxury inline-flex items-center gap-2 text-sm px-7 py-3 font-bold"
              >
                <span>🚀</span>
                <span>{t('wizard.restart')}</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="luxury-glass rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('scamCheck.title')}
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              {t('scamCheck.subtitle')}. Protect your Aadhaar, PAN and sensitive information with our domain validator.
            </p>
          </div>
          <Link
            to="/scam-check"
            className="btn-luxury text-sm whitespace-nowrap px-6 py-2.5 shrink-0"
          >
            {t('scamCheck.check')} →
          </Link>
        </section>
      </div>

      <AnimatePresence>
        {addModalOpen && (
          <AddServiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
