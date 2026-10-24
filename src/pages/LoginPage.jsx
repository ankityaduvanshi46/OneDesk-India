import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import Logo from '../components/Logo'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/dashboard'

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
        navigate(from, { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Login – OneDesk India Citizen & Administrative Portal</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-royal-850 rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700/80 p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron via-gold-400 to-india-green" />

        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Citizen Portal Login
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Access your government documents, applications, and verified services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              Email, Mobile, or Register ID
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
                placeholder="citizen@example.com / 9876543210"
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
            className="w-full mt-2 btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50"
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

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-royal-700 text-center space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Don't have an official OneDesk account?{' '}
            <Link to="/register" className="font-bold text-saffron hover:underline">
              Register as Citizen
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit SSL Cryptographic Data Isolation</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
