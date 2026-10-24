import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Cookie, Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('onedesk_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('onedesk_cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('onedesk_cookie_consent', 'essential_only')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-20 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md w-full luxury-glass rounded-2xl p-5 border border-gold-500/40 shadow-luxury dark:shadow-luxury-dark backdrop-blur-xl"
          role="region"
          aria-label="Privacy & Cookie Preferences"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0 border border-gold-500/30">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                <span>Citizen Privacy & DPDP Notice</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300/40 font-mono">
                  DPDP 2023
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[11px]">
                OneDesk uses strictly essential session cookies and local storage to preserve your theme, language, and cryptographic authentication. We never sell your personal data. Read our{' '}
                <Link to="/refund-policy" className="text-saffron font-semibold hover:underline">
                  Transparency Notice
                </Link>.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-royal-750 flex items-center justify-end gap-2 text-xs">
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 font-semibold transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="btn-luxury px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Continue</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
