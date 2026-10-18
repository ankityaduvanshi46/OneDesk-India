import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { services as defaultServices } from '../data/services'
import { isOfficialDomain, isValidUrl } from '../utils/helpers'

export const useAppStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      language: 'en',
      fontSize: 'md',
      selectedState: null,
      favourites: [],
      recentlyOpened: [],
      recentSearches: [],
      quickLinks: [],
      customServices: [],
      lastSyncTime: Date.now(),
      isAutoSyncing: false,

      setTheme: (theme) => {
        set({ theme })
        const root = document.documentElement
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      },

      toggleTheme: () => {
        const current = get().theme
        get().setTheme(current === 'dark' ? 'light' : 'dark')
      },

      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((s) => ({ language: s.language === 'en' ? 'hi' : 'en' })),

      setFontSize: (fontSize) => set({ fontSize }),
      cycleFontSize: () => {
        const sizes = ['sm', 'md', 'lg', 'xl']
        const current = get().fontSize
        const next = sizes[(sizes.indexOf(current) + 1) % sizes.length]
        set({ fontSize: next })
      },

      setSelectedState: (state) => set({ selectedState: state }),

      toggleFavourite: (serviceId) => {
        const { favourites } = get()
        if (favourites.includes(serviceId)) {
          set({ favourites: favourites.filter((id) => id !== serviceId) })
          return false
        } else {
          set({ favourites: [serviceId, ...favourites] })
          return true
        }
      },

      isFavourite: (serviceId) => get().favourites.includes(serviceId),

      addRecentlyOpened: (serviceId) => {
        const { recentlyOpened } = get()
        const filtered = recentlyOpened.filter((id) => id !== serviceId)
        set({ recentlyOpened: [serviceId, ...filtered].slice(0, 10) })
      },

      addRecentSearch: (query) => {
        if (!query.trim()) return
        const { recentSearches } = get()
        const filtered = recentSearches.filter((q) => q !== query)
        set({ recentSearches: [query, ...filtered].slice(0, 8) })
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addQuickLink: (serviceId) => {
        const { quickLinks } = get()
        if (!quickLinks.includes(serviceId)) {
          set({ quickLinks: [...quickLinks, serviceId] })
        }
      },

      removeQuickLink: (serviceId) => {
        set({ quickLinks: get().quickLinks.filter((id) => id !== serviceId) })
      },

      reorderQuickLinks: (newOrder) => set({ quickLinks: newOrder }),

      getAllServices: () => {
        const { customServices } = get()
        const seenUrls = new Set()
        const combined = []

        for (const s of [...customServices, ...defaultServices]) {
          if (!seenUrls.has(s.url)) {
            seenUrls.add(s.url)
            combined.push(s)
          }
        }
        return combined
      },

      addServiceAuto: (newService) => {
        if (!isValidUrl(newService.url) || !isOfficialDomain(newService.url)) {
          throw new Error('Only verified official government domains (.gov.in, .nic.in) can be added.')
        }

        const id = newService.id || 'service-' + Date.now()
        const serviceToAdd = {
          ...newService,
          id,
          verified: true,
          isUserAdded: true,
          addedAt: Date.now()
        }

        const existing = get().customServices.filter((s) => s.url !== newService.url)
        set({
          customServices: [serviceToAdd, ...existing],
          lastSyncTime: Date.now()
        })
        return serviceToAdd
      },

      triggerAutoSync: async () => {
        set({ isAutoSyncing: true })
        await new Promise((resolve) => setTimeout(resolve, 800))
        set({
          lastSyncTime: Date.now(),
          isAutoSyncing: false
        })
      },

      initTheme: () => {
        const { theme } = get()
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      }
    }),
    {
      name: 'onedesk-india-store',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        fontSize: state.fontSize,
        selectedState: state.selectedState,
        favourites: state.favourites,
        recentlyOpened: state.recentlyOpened,
        recentSearches: state.recentSearches,
        quickLinks: state.quickLinks,
        customServices: state.customServices,
        lastSyncTime: state.lastSyncTime
      })
    }
  )
)
