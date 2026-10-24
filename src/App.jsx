import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'
import { useAuthStore } from './store/useAuthStore'
import { initAnalytics, trackPageView } from './utils/analytics'
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
const DependentProfilesPage = lazy(() => import('./pages/DependentProfilesPage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'))
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage'))

// E-E-A-T Trust & Strategic Blog Pages
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))

export default function App() {
  const { initTheme, initLanguage, theme, fontSize } = useAppStore()
  const { checkAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    initTheme()
    initLanguage()
    checkAuth()
    initAnalytics()
    const timer = setTimeout(() => {
      setLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [initTheme, initLanguage, checkAuth])

  // Track pageviews on SPA navigation
  useEffect(() => {
    trackPageView(location.pathname, document.title)
  }, [location.pathname])

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
              {/* Public Routes (SEO-indexable) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
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

              {/* E-E-A-T Trust & Editorial Guides */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Private / Citizen Account Routes (noindex, nofollow) */}
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
              <Route
                path="/family-profiles"
                element={
                  <ProtectedRoute>
                    <DependentProfilesPage />
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
