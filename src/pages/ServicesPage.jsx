import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import SEOHead from '../components/SEOHead'
import Fuse from 'fuse.js'
import CategoryChips from '../components/CategoryChips'
import StateSelector from '../components/StateSelector'
import ServiceCard from '../components/ServiceCard'
import AddServiceModal from '../components/AddServiceModal'
import { useAppStore } from '../store/useAppStore'
import { sanitizeInput } from '../utils/helpers'

export default function ServicesPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedState, getAllServices } = useAppStore()

  const allServices = getAllServices()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const fuse = useMemo(() => {
    return new Fuse(allServices, {
      keys: [
        { name: 'name', weight: 3 },
        { name: 'nameHi', weight: 3 },
        { name: 'description', weight: 1.5 },
        { name: 'descriptionHi', weight: 1.5 },
        { name: 'keywords', weight: 2 },
        { name: 'category', weight: 1 },
        { name: 'documents', weight: 1.5 }
      ],
      threshold: 0.35,
      minMatchCharLength: 2
    })
  }, [allServices])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setQuery(q)
  }, [searchParams])

  const filteredServices = useMemo(() => {
    let result = [...allServices]

    if (query.trim()) {
      const searchResults = fuse.search(query.trim())
      result = searchResults.map((r) => r.item)
    }

    if (category !== 'all') {
      result = result.filter((s) => s.category === category)
    }

    if (selectedState) {
      result.sort((a, b) => {
        if (a.state === selectedState && b.state !== selectedState) return -1
        if (b.state === selectedState && a.state !== selectedState) return 1
        return 0
      })
    }

    return result
  }, [allServices, fuse, query, category, selectedState])

  const handleQueryChange = (val) => {
    const rawVal = val.replace(/<[^>]*>/g, '').slice(0, 200)
    setQuery(rawVal)
    if (rawVal.trim()) {
      searchParams.set('q', rawVal.trim())
    } else {
      searchParams.delete('q')
    }
    setSearchParams(searchParams)
  }

  const handleCategorySelect = (catId) => {
    setCategory(catId)
    if (catId !== 'all') {
      searchParams.set('category', catId)
    } else {
      searchParams.delete('category')
    }
    setSearchParams(searchParams)
  }

  const handleReset = () => {
    setQuery('')
    setCategory('all')
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <SEOHead
        title="Government Services Directory (80+ Portals)"
        description="Directory of 80+ official Indian government services. Filter by category or state for Aadhaar, PAN, Transport, Certificates, Taxes, and Schemes."
        canonical="/services"
        keywords={['government portals directory', 'indian public services', 'aadhaar', 'pan card', 'parivahan', 'edistrict']}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white">
              {t('categories.all')}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {filteredServices.length} {t('search.results')} • Auto-synchronized catalog
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAddModalOpen(true)}
              className="btn-luxury text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>{lang === 'hi' ? 'पोर्टल जोड़ें' : 'Auto-Add Portal'}</span>
            </button>
            <StateSelector />
          </div>
        </div>

        <div className="relative max-w-xl">
          <span className="absolute left-3.5 top-3 text-gray-400" aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-royal-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm shadow-sm"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          )}
        </div>

        <CategoryChips activeCategory={category} onSelectCategory={handleCategorySelect} />
      </div>

      {filteredServices.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="luxury-glass rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="text-5xl" aria-hidden="true">🔍</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('search.noResults')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('search.noResultsHint')}
          </p>
          <button
            onClick={handleReset}
            className="btn-luxury text-xs px-6 py-2.5"
          >
            {lang === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      )}

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
