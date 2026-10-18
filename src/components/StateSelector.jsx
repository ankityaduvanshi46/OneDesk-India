import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import { STATES } from '../data/services'

export default function StateSelector() {
  const { t } = useTranslation()
  const { selectedState, setSelectedState } = useAppStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">
        📍 {t('settings.state')}:
      </span>
      <select
        value={selectedState || ''}
        onChange={(e) => setSelectedState(e.target.value || null)}
        className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer"
        aria-label="Filter by state"
      >
        <option value="">All India (National)</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {selectedState && (
        <button
          onClick={() => setSelectedState(null)}
          className="text-xs text-brand-primary hover:underline"
          title="Reset state filter"
        >
          ✕
        </button>
      )}
    </div>
  )
}
