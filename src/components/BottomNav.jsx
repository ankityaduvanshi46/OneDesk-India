import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, PlusCircle, User, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function BottomNav() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const items = [
    { to: '/', icon: Home, label: 'Home', exact: true },
    { to: '/services', icon: LayoutGrid, label: 'Services' },
    { to: '/apply', icon: PlusCircle, label: 'Apply' },
    { to: isAuthenticated ? '/dashboard' : '/login', icon: User, label: isAuthenticated ? 'Dashboard' : 'Sign In' },
    { to: '/verify-document', icon: ShieldCheck, label: 'Verify' }
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/98 dark:bg-[#071326] backdrop-blur-lg border-t-2 border-slate-200 dark:border-royal-750 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] safe-area-inset-bottom select-none"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16 px-1">
        {items.map((item) => {
          const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
          const IconComp = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative py-1"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute top-0 inset-x-4 h-1 bg-gradient-to-r from-saffron to-gold-500 rounded-b-full shadow-sm"
                />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-saffron bg-saffron/10 dark:bg-saffron/20'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span
                className={`text-[11px] tracking-tight leading-none ${
                  isActive
                    ? 'font-bold text-saffron dark:text-saffron'
                    : 'font-semibold text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
