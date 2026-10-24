import { useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  QrCode,
  FileText
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { sanitizeReturnUrl } from '../utils/helpers'
import Logo from '../components/Logo'
import { IdentityIllustration } from '../components/design-system/ServiceIllustrations'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Safely extract and validate returnUrl from query or router state
  const rawTarget = searchParams.get('returnUrl') || location.state?.from?.pathname || '/dashboard'
  const targetDestination = sanitizeReturnUrl(rawTarget, '/dashboard')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      toast.error('Please enter your Email/Mobile/Register ID and password.')
      return
    }

    try {
      setSubmitting(true)
      const user = await login({ identifier, password })
      toast.success(`Welcome back, ${user.name}!`)
      if (user.role === 'super_admin' || user.role === 'staff') {
        navigate('/admin')
      } else {
        navigate(targetDestination, { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <Helmet>
        <title>Citizen Sign In – OneDesk India</title>
        <meta name="description" content="Sign in to your OneDesk citizen account to access your digital locker and applications." />
      </Helmet>

      {/* Split Screen Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl luxury-glass rounded-3xl overflow-hidden border border-gray-100 dark:border-royal-750 shadow-luxury grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Side: Imperial Republic Brand Showcase (Visible on lg+) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-royal-950 via-royal-900 to-royal-850 p-10 text-white flex-col justify-between relative overflow-hidden border-r border-royal-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Logo size="md" />

            <div className="pt-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 bg-gold-500/20 px-2.5 py-0.5 rounded-full border border-gold-500/30">
                Single-Window Citizen Desk
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                Welcome to OneDesk Digital Gateway
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Log in to securely track government applications, access verified certificates, and manage your digital locker.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-royal-800/60 border border-gold-500/30 flex items-center gap-4">
              <div className="p-2 rounded-xl bg-royal-900 shrink-0">
                <IdentityIllustration className="w-12 h-12" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-gold-300">Strict Data Isolation</div>
                <div className="text-[11px] text-gray-300 mt-0.5">
                  One-Citizen-One-Account verified by cryptographic hashing.
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Cold Calls or Unsolicited Marketing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Links to 80+ Official Portals</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-royal-800 text-[11px] text-gray-400 relative z-10 flex items-center justify-between">
            <span>DPDP Act 2023 Compliant</span>
            <span className="text-gold-400">Ver. 2.0</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Citizen Portal Sign In
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter your credentials to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Email, Mobile, or Citizen ID
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email, mobile, or citizen ID"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-bold"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Secure Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 dark:border-royal-750 text-center space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Don't have an official OneDesk account?{' '}
                <Link
                  to={searchParams.get('returnUrl') ? `/register?returnUrl=${encodeURIComponent(searchParams.get('returnUrl'))}` : '/register'}
                  className="font-bold text-saffron hover:underline"
                >
                  Register as Citizen
                </Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit SSL Cryptographic Data Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
