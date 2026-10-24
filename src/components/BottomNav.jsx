import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'

export default function BottomNav() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const items = [
    { to: '/', icon: '🏛️', label: 'Home', exact: true },
    { to: '/services', icon: '📋', label: 'Services' },
    { to: '/apply', icon: '✨', label: 'Apply' },
    { to: isAuthenticated ? '/dashboard' : '/login', icon: isAuthenticated ? '👤' : '🔑', label: isAuthenticated ? 'Dashboard' : 'Sign In' },
    { to: '/verify-document', icon: '🛡️', label: 'Verify' }
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-royal-900/95 backdrop-blur-md border-t border-gray-200 dark:border-royal-800 safe-area-inset-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {items.map((item) => {
          const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 inset-x-3 h-0.5 bg-gradient-to-r from-saffron to-gold-500 rounded-b-full"
                />
              )}
              <span className={`text-lg transition-all ${isActive ? 'scale-110' : 'opacity-60'}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold ${isActive ? 'text-saffron' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
