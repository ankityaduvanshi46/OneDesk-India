import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import { TRENDING_SERVICES } from '../data/services'
import { useAppStore } from '../store/useAppStore'
import { sanitizeInput, debounce } from '../utils/helpers'
import { trackSearchQuery } from '../utils/analytics'

export default function SearchBar({ compact = false, autoFocus = false }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { recentSearches, addRecentSearch, clearRecentSearches, getAllServices } = useAppStore()

  const allServices = getAllServices()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const recognitionRef = useRef(null)

  const fuse = useMemo(() => {
    return new Fuse(allServices, {
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
  }, [allServices])

  const trendingServices = useMemo(() => {
    return TRENDING_SERVICES.slice(0, 5).map((id) => allServices.find((s) => s.id === id)).filter(Boolean)
  }, [allServices])

  const search = useCallback(
    debounce((q) => {
      if (!q.trim()) { setResults([]); return }
      const r = fuse.search(q).slice(0, 8)
      setResults(r.map((r) => r.item))
    }, 150),
    [fuse]
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
        trackSearchQuery(query.trim(), results.length)
        navigate(`/services?q=${encodeURIComponent(query.trim())}`)
        setIsOpen(false)
        setQuery('')
      }
    }
  }

  const handleSelect = (service) => {
    addRecentSearch(service.name)
    trackSearchQuery(service.name, 1)
    navigate(`/services/${service.id}`)
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
      <div className={`relative flex items-center ${compact ? 'h-10' : 'h-13'}`}>
        <span className="absolute left-3.5 text-gray-400 pointer-events-none text-base" aria-hidden="true">
          {isListening ? '🎤' : '🔍'}
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            const rawVal = e.target.value.replace(/<[^>]*>/g, '').slice(0, 200)
            setQuery(rawVal)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? t('search.placeholderShort') : t('search.placeholder')}
          className={`w-full pl-10 pr-24 rounded-2xl border border-gray-200 dark:border-gold-500/30 bg-white dark:bg-royal-850 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary shadow-sm transition-all ${compact ? 'h-10 text-xs sm:text-sm' : 'h-12 text-sm sm:text-base'}`}
          aria-label={t('search.placeholder')}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {!compact && (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-royal-750 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-md">
              ⌘K
            </kbd>
          )}
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
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-royal-850 rounded-2xl shadow-2xl border border-gray-100 dark:border-gold-500/30 overflow-hidden z-50 max-h-[70vh] overflow-y-auto scrollbar-hide backdrop-blur-md"
            role="listbox"
            aria-label="Search suggestions"
          >
            {query.trim() && results.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{results.length} {t('search.results')}</span>
                  <span className="text-[10px] text-emerald-500">{lang === 'hi' ? 'सत्यापित' : 'Live verified'}</span>
                </div>
                {results.map((service, i) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelect(service)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-royal-750 transition-colors text-left ${selectedIndex === i ? 'bg-orange-50 dark:bg-orange-950/30' : ''}`}
                    role="option"
                    aria-selected={selectedIndex === i}
                  >
                    <ServiceAvatar service={service} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                        <span>{lang === 'hi' && service.nameHi ? service.nameHi : service.name}</span>
                        {service.isUserAdded && (
                          <span className="text-[9px] px-1 py-0.2 bg-gold-500/20 text-gold-600 dark:text-gold-300 rounded font-bold">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {lang === 'hi' && service.descriptionHi ? service.descriptionHi : service.description}
                      </div>
                    </div>
                    {service.verified && <span className="text-emerald-500 text-xs shrink-0 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <div className="px-4 py-6 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">{t('search.noResults')}</p>
                <p className="text-gray-400 text-xs mt-1">{t('search.noResultsHint')}</p>
              </div>
            )}

            {!query.trim() && (
              <div>
                {recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('search.recent')}</span>
                      <button onClick={clearRecentSearches} className="text-xs text-brand-primary hover:underline">
                        {lang === 'hi' ? 'हटाएं' : 'Clear'}
                      </button>
                    </div>
                    {recentSearches.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        onClick={() => { setQuery(q); setIsOpen(true) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-royal-750 transition-colors text-left text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-gray-400 text-xs">🕐</span>
                        <span>{q}</span>
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
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-royal-750 transition-colors text-left ${selectedIndex === i ? 'bg-orange-50 dark:bg-orange-950/30' : ''}`}
                    >
                      <span className="text-gray-400 text-xs">🔥</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{service.name}</span>
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
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'

  if (service.logo && !imgError) {
    return (
      <img
        src={service.logo}
        alt=""
        onError={() => setImgError(true)}
        className={`${dim} rounded-xl object-contain bg-gray-50 dark:bg-royal-700 p-0.5 shrink-0 border border-gray-100 dark:border-gray-700`}
        aria-hidden="true"
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={`${dim} rounded-xl flex items-center justify-center text-white font-extrabold shrink-0 shadow-sm border border-white/20`}
      style={{ backgroundColor: service.logoColor || '#FF6B35' }}
      aria-hidden="true"
    >
      {service.logoFallback || service.name.charAt(0)}
    </div>
  )
}
