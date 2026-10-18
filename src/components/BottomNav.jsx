import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

const NAV_ITEMS = [
  { to: '/', icon: '🏠', key: 'home', exact: true },
  { to: '/services', icon: '📋', key: 'services' },
  { to: '/wizard', icon: '🧭', key: 'wizard' },
  { to: '/favourites', icon: '❤️', key: 'favourites' },
  { to: '/quick-links', icon: '⚡', key: 'quickLinks' }
]

export default function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-inset-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative"
              aria-label={t(`nav.${item.key}`)}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 inset-x-3 h-0.5 bg-brand-primary rounded-b-full"
                />
              )}
              <span className={`text-xl transition-all ${isActive ? 'scale-110' : 'opacity-60'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                {t(`nav.${item.key}`)}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
