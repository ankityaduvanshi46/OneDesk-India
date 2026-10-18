import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import { services, TRENDING_SERVICES } from '../data/services'
import { useAppStore } from '../store/useAppStore'
import { sanitizeInput, debounce } from '../utils/helpers'

const fuse = new Fuse(services, {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'nameHi', weight: 3 },
    { name: 'description', weight: 1 },
    { name: 'descriptionHi', weight: 1 },
    { name: 'keywords', weight: 2 },
    { name: 'category', weight: 1 }
  ],
  threshold: 0.4,
  includeMatches: true,
  minMatchCharLength: 2
})

export default function SearchBar({ compact = false, autoFocus = false }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { recentSearches, addRecentSearch, clearRecentSearches } = useAppStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const recognitionRef = useRef(null)

  const trendingServices = TRENDING_SERVICES.slice(0, 5).map((id) => services.find((s) => s.id === id)).filter(Boolean)

  const search = useCallback(
    debounce((q) => {
      if (!q.trim()) { setResults([]); return }
      const r = fuse.search(q).slice(0, 8)
      setResults(r.map((r) => r.item))
    }, 150),
    []
  )

  useEffect(() => {
    search(query)
    setSelectedIndex(-1)
  }, [query, search])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e) => {
    const items = results.length ? results : trendingServices
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, items.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, -1)) }
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        handleSelect(items[selectedIndex])
      } else if (query.trim()) {
        addRecentSearch(query.trim())
        navigate(`/services?q=${encodeURIComponent(query.trim())}`)
        setIsOpen(false)
        setQuery('')
      }
    }
  }

  const handleSelect = (service) => {
    addRecentSearch(service.name)
    navigate(`/service/${service.id}`)
    setIsOpen(false)
    setQuery('')
  }

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in your browser.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setQuery(transcript)
      setIsOpen(true)
      inputRef.current?.focus()
    }
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0)

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`relative flex items-center ${compact ? 'h-10' : 'h-12'}`}>
        <span className="absolute left-3 text-gray-400 pointer-events-none" aria-hidden="true">
          {isListening ? '🎤' : '🔍'}
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => { setQuery(sanitizeInput(e.target.value)); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? t('search.placeholderShort') : t('search.placeholder')}
          className={`w-full pl-9 pr-20 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all ${compact ? 'h-10 text-sm' : 'h-12 text-base'}`}
          aria-label={t('search.placeholder')}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            onClick={startVoiceSearch}
            className={`p-1.5 rounded-lg transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-brand-primary'}`}
            aria-label={isListening ? t('search.listening') : t('search.voiceSearch')}
          >
            🎤
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 max-h-[70vh] overflow-y-auto scrollbar-hide"
            role="listbox"
            aria-label="Search suggestions"
          >
            {query.trim() && results.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {results.length} {t('search.results')}
                </div>
                {results.map((service, i) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${selectedIndex === i ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                    role="option"
                    aria-selected={selectedIndex === i}
                  >
                    <ServiceAvatar service={service} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{service.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{service.description}</div>
                    </div>
                    {service.verified && <span className="text-green-500 text-xs shrink-0">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="px-4 py-6 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('search.noResults')}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{t('search.noResultsHint')}</p>
              </div>
            )}

            {!query.trim() && (
              <div>
                {recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('search.recent')}</span>
                      <button onClick={clearRecentSearches} className="text-xs text-brand-primary hover:underline">Clear</button>
                    </div>
                    {recentSearches.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        onClick={() => { setQuery(q); setIsOpen(true) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-gray-400">🕐</span>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t('search.trending')}
                  </div>
                  {trendingServices.map((service, i) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelect(service)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${selectedIndex === i ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                    >
                      <span className="text-gray-400">🔥</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ServiceAvatar({ service, size = 'md' }) {
  const [imgError, setImgError] = useState(false)
  const dim = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base'

  if (service.logo && !imgError) {
    return (
      <img
        src={service.logo}
        alt=""
        onError={() => setImgError(true)}
        className={`${dim} rounded-lg object-contain bg-gray-100 dark:bg-gray-800 p-0.5 flex-shrink-0`}
        aria-hidden="true"
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`${dim} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: service.logoColor || '#FF6B35' }}
      aria-hidden="true"
    >
      {service.logoFallback || service.name.charAt(0)}
    </div>
  )
}
