import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

export default function Preloader({ onComplete }) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950 select-none"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-saffron-DEFAULT to-orange-600 flex items-center justify-center shadow-xl p-3">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none">
              <rect x="14" y="16" width="72" height="48" rx="8" fill="#0F1B5E" />
              <rect x="18" y="20" width="64" height="40" rx="5" fill="#FFFFFF" />
              <circle cx="50" cy="40" r="14" fill="#000080" />
              <circle cx="50" cy="40" r="11" fill="#FFFFFF" />
              <circle cx="50" cy="40" r="3.5" fill="#000080" />
              <line x1="50" y1="29" x2="50" y2="51" stroke="#000080" strokeWidth="1" />
              <line x1="39" y1="40" x2="61" y2="40" stroke="#000080" strokeWidth="1" />
              <line x1="42.2" y1="32.2" x2="57.8" y2="47.8" stroke="#000080" strokeWidth="1" />
              <line x1="42.2" y1="47.8" x2="57.8" y2="32.2" stroke="#000080" strokeWidth="1" />
              <path d="M43 64 L57 64 L60 76 L40 76 Z" fill="#FFFFFF" />
              <rect x="32" y="76" width="36" height="5" rx="2.5" fill="#FFFFFF" />
              <rect x="18" y="55" width="64" height="5" rx="1.5" fill="url(#preloadTricolor)" />
              <defs>
                <linearGradient id="preloadTricolor" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#138808" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-india-green"></span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-1"
        >
          <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            OneDesk <span className="text-brand-primary">India</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            One-Stop Official Government Services Hub
          </div>
        </motion.div>

        <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-saffron-DEFAULT via-white to-india-green rounded-full"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] text-gray-400 dark:text-gray-500 font-medium"
        >
          Verified • Fast • Accessible for Everyone
        </motion.p>
      </div>
    </motion.div>
  )
}
