import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../data/services'
import { useAppStore } from '../store/useAppStore'
import { checkUrlDomain, sanitizeInput } from '../utils/helpers'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

export default function AddServiceModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation()
  const { addServiceAuto } = useAppStore()

  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [nameHi, setNameHi] = useState('')
  const [category, setCategory] = useState('identity')
  const [description, setDescription] = useState('')
  const [helpline, setHelpline] = useState('')
  const [fees, setFees] = useState('Free')
  const [urlValidation, setUrlValidation] = useState(null)

  if (!isOpen) return null

  const handleUrlBlur = () => {
    if (!url.trim()) return
    const res = checkUrlDomain(url)
    setUrlValidation(res)

    if (res.official && !name) {
      try {
        const parsed = new URL(url.startsWith('http') ? url : 'https://' + url)
        const hostParts = parsed.hostname.split('.')
        const mainPart = hostParts.length >= 2 ? hostParts[0] : parsed.hostname
        setName(mainPart.toUpperCase() + ' Portal')
      } catch {}
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const domainCheck = checkUrlDomain(url)
    if (!domainCheck.official) {
      toast.error('Only verified official .gov.in, .nic.in, or whitelisted domains can be added to OneDesk India.')
      return
    }

    if (!name.trim() || !description.trim()) {
      toast.error('Please fill in the portal name and description.')
      return
    }

    try {
      const fullUrl = url.startsWith('http') ? url.trim() : 'https://' + url.trim()
      addServiceAuto({
        name: sanitizeInput(name),
        nameHi: sanitizeInput(nameHi || name),
        url: fullUrl,
        category,
        description: sanitizeInput(description),
        descriptionHi: sanitizeInput(description),
        helpline: sanitizeInput(helpline),
        fees: sanitizeInput(fees),
        logoFallback: name.charAt(0).toUpperCase(),
        logoColor: '#FF6B35',
        documents: ['Aadhaar / Identity Proof'],
        steps: ['Visit official website', 'Follow on-screen instructions']
      })

      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } })
      toast.success('Official portal verified and added to directory!', { icon: '✨' })
      onClose()
      setUrl('')
      setName('')
      setDescription('')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-royal-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white dark:bg-royal-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gold-500/30 p-6 sm:p-8 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-white text-lg shadow-sm">
              ✨
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Auto-Add Official Portal
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instantly append a verified government service to directory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Official Portal Website URL *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlValidation(null) }}
              onBlur={handleUrlBlur}
              placeholder="https://cybercrime.gov.in"
              className="w-full py-2.5 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {urlValidation && (
              <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${urlValidation.official ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                <span>{urlValidation.official ? '✓' : '⚠️'}</span>
                <span>{urlValidation.message}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Portal Name (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. National Cyber Crime Reporting"
                className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Portal Name (हिंदी)
              </label>
              <input
                type="text"
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                placeholder="उदा. राष्ट्रीय साइबर अपराध पोर्टल"
                className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              One-Line Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What citizen service does this portal provide?"
              className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Helpline (Optional)
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                placeholder="e.g. 1930"
                className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                Fees
              </label>
              <input
                type="text"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="Free / Rs. 50"
                className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-luxury-outline text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-luxury text-xs py-2.5 px-6 shadow-md"
            >
              Verify & Add Service
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
