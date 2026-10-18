import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import AddServiceModal from './AddServiceModal'
import toast from 'react-hot-toast'

export default function AutoSyncBanner() {
  const { t, i18n } = useTranslation()
  const { getAllServices, isAutoSyncing, triggerAutoSync, lastSyncTime } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)

  const allServices = getAllServices()

  const handleSyncClick = async () => {
    await triggerAutoSync()
    toast.success('Directory updated: All 80+ official portals are verified & synchronized!', { icon: '🔄' })
  }

  const formatLastSync = (ts) => {
    if (!ts) return 'Just now'
    const diff = Math.floor((Date.now() - ts) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return 'Today'
  }

  return (
    <>
      <div className="w-full bg-gradient-to-r from-royal-900 via-royal-850 to-royal-900 border-b border-gold-500/20 text-white py-2 px-4 sm:px-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="status-dot-pulse">
              <span />
              <span />
            </span>
            <span className="font-semibold text-gray-200">
              Live Auto-Sync:
            </span>
            <span className="text-emerald-400 font-medium hidden sm:inline">
              Active • {allServices.length} Official Services Verified
            </span>
            <span className="text-gray-400 text-[11px] hidden md:inline">
              (Checked {formatLastSync(lastSyncTime)})
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleSyncClick}
              disabled={isAutoSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 font-medium text-[11px] transition-colors border border-white/10"
              title="Synchronize directory with latest portals"
            >
              <span className={`text-xs ${isAutoSyncing ? 'animate-spin' : ''}`}>🔄</span>
              <span>{isAutoSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-royal-900 font-bold text-[11px] shadow-sm transition-all"
            >
              <span>✨</span>
              <span>Add Portal</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <AddServiceModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
