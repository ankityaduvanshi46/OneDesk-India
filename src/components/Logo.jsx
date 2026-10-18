import { useTranslation } from 'react-i18next'

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const { t, i18n } = useTranslation()
  const isHi = i18n.language === 'hi'

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`${iconSizes[size] || iconSizes.md} shrink-0 relative flex items-center justify-center rounded-xl bg-gradient-to-br from-saffron to-orange-600 shadow-sm p-1.5`}>
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
          <rect x="18" y="55" width="64" height="5" rx="1.5" fill="url(#logoTricolorMini)" />
          <defs>
            <linearGradient id="logoTricolorMini" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-extrabold tracking-tight ${textSizes[size] || textSizes.md} text-gray-900 dark:text-white flex items-center`}>
            <span>{isHi ? 'वनडेस्क' : 'OneDesk'}</span>
            <span className="text-brand-primary ml-1">{isHi ? 'इंडिया' : 'India'}</span>
          </div>
          <span className="text-[9px] font-bold text-india-green tracking-wider uppercase mt-0.5">
            {isHi ? 'राष्ट्रीय सरकारी सेवा पोर्टल' : 'National Civic Directory'}
          </span>
        </div>
      )}
    </div>
  )
}
