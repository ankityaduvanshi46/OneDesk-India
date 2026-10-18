import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function Preloader() {
  const { t, i18n } = useTranslation()
  const isHi = i18n.language === 'hi'

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-royal-900 via-royal-850 to-royal-900 text-white select-none overflow-hidden"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-6 max-w-sm px-6 text-center relative z-10">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-gold-500/30 border-dashed"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-royal-850 via-royal-800 to-royal-850 border-2 border-gold-500/50 flex items-center justify-center shadow-glow-gold p-3.5"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none">
              <rect x="14" y="16" width="72" height="48" rx="8" fill="#0B132B" stroke="#D4AF37" strokeWidth="1" />
              <rect x="18" y="20" width="64" height="40" rx="5" fill="#FFFFFF" />
              <circle cx="50" cy="40" r="14" fill="#000080" />
              <circle cx="50" cy="40" r="11" fill="#FFFFFF" />
              <circle cx="50" cy="40" r="3.5" fill="#000080" />
              <line x1="50" y1="29" x2="50" y2="51" stroke="#000080" strokeWidth="1" />
              <line x1="39" y1="40" x2="61" y2="40" stroke="#000080" strokeWidth="1" />
              <line x1="42.2" y1="32.2" x2="57.8" y2="47.8" stroke="#000080" strokeWidth="1" />
              <line x1="42.2" y1="47.8" x2="57.8" y2="32.2" stroke="#000080" strokeWidth="1" />
              <path d="M43 64 L57 64 L60 76 L40 76 Z" fill="#D4AF37" />
              <rect x="32" y="76" width="36" height="5" rx="2.5" fill="#D4AF37" />
              <rect x="18" y="55" width="64" height="5" rx="1.5" fill="url(#preloadTricolor)" />
              <defs>
                <linearGradient id="preloadTricolor" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#138808" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-sm"></span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5"
        >
          <div className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>{isHi ? 'वनडेस्क' : 'OneDesk'}</span>
            <span className="text-brand-primary">{isHi ? 'इंडिया' : 'India'}</span>
          </div>
          <div className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">
            {isHi ? 'राष्ट्रीय सरकारी सेवा हब' : 'National Civic Gateway'}
          </div>
        </motion.div>

        <div className="w-56 h-1.5 bg-royal-700/80 rounded-full overflow-hidden p-0.5 border border-gold-500/20">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-gradient-to-r from-saffron via-gold-400 to-india-green rounded-full shadow-sm"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-2 text-[11px] text-gray-400 font-medium"
        >
          <span className="text-emerald-400">●</span>
          <span>Verified Portals Sync Active</span>
          <span className="text-gray-600">•</span>
          <span>High Security</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
