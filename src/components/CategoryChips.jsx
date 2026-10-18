import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CATEGORIES, services } from '../data/services'

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const getServiceCount = (categoryId) => {
    if (categoryId === 'all') return services.length
    return services.filter((s) => s.category === categoryId).length
  }

  const allCategories = [
    { id: 'all', label: 'All Services', labelHi: 'सभी सेवाएं', icon: '🏛' },
    ...CATEGORIES
  ]

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2" role="tablist" aria-label="Categories">
      <div className="flex items-center gap-2 min-w-max px-1">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat.id
          const count = getServiceCount(cat.id)
          const label = lang === 'hi' && cat.labelHi ? cat.labelHi : cat.label

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                isActive
                  ? 'text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-brand-primary rounded-full shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 text-base" aria-hidden="true">{cat.icon}</span>
              <span className="relative z-10 whitespace-nowrap">{label}</span>
              <span
                className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
