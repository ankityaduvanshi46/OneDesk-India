import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import Fuse from 'fuse.js'
import CategoryChips from '../components/CategoryChips'
import StateSelector from '../components/StateSelector'
import ServiceCard from '../components/ServiceCard'
import { services } from '../data/services'
import { useAppStore } from '../store/useAppStore'
import { sanitizeInput } from '../utils/helpers'

const fuse = new Fuse(services, {
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

export default function ServicesPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedState } = useAppStore()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setQuery(q)
  }, [searchParams])

  const filteredServices = useMemo(() => {
    let result = [...services]

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
  }, [query, category, selectedState])

  const handleQueryChange = (val) => {
    const clean = sanitizeInput(val)
    setQuery(clean)
    if (clean) {
      searchParams.set('q', clean)
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
      <Helmet>
        <title>All Services Directory – {t('siteName')}</title>
        <meta name="description" content="Browse all 80+ official Indian government services. Direct portals for Aadhaar, Voter ID, PAN, Transport, e-District, Taxes, and Schemes." />
      </Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {t('categories.all')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredServices.length} {t('search.results')}
            </p>
          </div>
          <StateSelector />
        </div>

        <div className="relative max-w-xl">
          <span className="absolute left-3.5 top-3 text-gray-400" aria-hidden="true">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 max-w-md mx-auto space-y-4 shadow-sm">
          <div className="text-5xl" aria-hidden="true">🔍</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('search.noResults')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('search.noResultsHint')}
          </p>
          <button
            onClick={handleReset}
            className="btn-primary text-sm px-6 py-2"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
