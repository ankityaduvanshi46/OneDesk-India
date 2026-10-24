import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import Layout from './components/Layout'
import PageLoader from './components/ui/PageLoader'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const WizardPage = lazy(() => import('./pages/WizardPage'))
const FavouritesPage = lazy(() => import('./pages/FavouritesPage'))
const QuickLinksPage = lazy(() => import('./pages/QuickLinksPage'))
const ScamCheckPage = lazy(() => import('./pages/ScamCheckPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ApplyServicePage = lazy(() => import('./pages/ApplyServicePage'))
const MyDocumentsPage = lazy(() => import('./pages/MyDocumentsPage'))
const VerifyDocumentPage = lazy(() => import('./pages/VerifyDocumentPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'))
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'))

export default function App() {
  const { initTheme, theme, fontSize } = useAppStore()
  const { checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initTheme()
    checkAuth()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [initTheme, checkAuth])

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
              {/* Public Routes (No login required, SEO-indexable) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/service/:id" element={<ServiceDetailPage />} />
              <Route path="/wizard" element={<WizardPage />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/quick-links" element={<QuickLinksPage />} />
              <Route path="/scam-check" element={<ScamCheckPage />} />
              <Route path="/verify-document" element={<VerifyDocumentPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />

              {/* Login Required Routes (Citizen, Staff, Admin) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply"
                element={
                  <ProtectedRoute>
                    <ApplyServicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <MyDocumentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <SupportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Administrative Routes (Restricted: Staff & Super Admin) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles={['staff', 'super_admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
