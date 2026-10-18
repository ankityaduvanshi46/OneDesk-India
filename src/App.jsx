import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import Layout from './components/Layout'
import PageLoader from './components/ui/PageLoader'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const WizardPage = lazy(() => import('./pages/WizardPage'))
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'))
const QuickLinksPage = lazy(() => import('./pages/QuickLinksPage'))
const ScamCheckPage = lazy(() => import('./pages/ScamCheckPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  const { initTheme, theme, fontSize } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initTheme()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [initTheme])

  useEffect(() => {
    const sizes = { sm: '0.875', md: '1', lg: '1.125', xl: '1.25' }
    document.documentElement.style.setProperty('--font-size-multiplier', sizes[fontSize] || '1')
  }, [fontSize])

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 2500,
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' }
          }}
        />

        <AnimatePresence>
          {loading && <Preloader />}
        </AnimatePresence>

        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/service/:id" element={<ServiceDetailPage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/quick-links" element={<QuickLinksPage />} />
              <Route path="/scam-check" element={<ScamCheckPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
