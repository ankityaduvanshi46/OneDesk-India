import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import Logo from '../components/Logo'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, verifyOtp, resendOtp, otpPendingEmail } = useAuthStore()

  const [step, setStep] = useState(otpPendingEmail ? 2 : 1)
  const [formData, setFormData] = useState({
    name: '',
    email: otpPendingEmail || '',
    mobile: '',
    govIdNumber: '',
    govIdType: 'aadhaar_last4',
    password: '',
    confirmPassword: ''
  })
  const [otpCode, setOtpCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (formData.password.length < 8) {
      toast.error('Password must contain at least 8 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      toast.error('Please enter a valid 10-digit Indian mobile number.')
      return
    }

    try {
      setSubmitting(true)
      await register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        govIdNumber: formData.govIdNumber,
        govIdType: formData.govIdType,
        password: formData.password
      })
      toast.success('Registration initiated! 6-digit OTP sent to your email.')
      setStep(2)
    } catch (err) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code.')
      return
    }

    try {
      setSubmitting(true)
      const user = await verifyOtp(otpCode.trim())
      toast.success(`Account verified! Welcome to OneDesk, ${user.name}.`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    try {
      setResending(true)
      await resendOtp()
      toast.success('Fresh verification code sent to your email.')
    } catch (err) {
      toast.error(err.message || 'Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Citizen Registration – OneDesk India</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-royal-850 rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700/80 p-8 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron via-gold-400 to-india-green" />

        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {step === 1 ? 'Citizen Account Registration' : 'Verify Email Address'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {step === 1
              ? 'One Person = One Account official registry for citizen documents'
              : `Enter the 6-digit verification code sent to ${formData.email}`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 1 ? 'text-gold-500' : 'text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center text-[10px]">1</span>
            <span>Profile Details</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200 dark:bg-royal-700" />
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 2 ? 'text-gold-500' : 'text-gray-400'}`}>
            <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center text-[10px]">2</span>
            <span>OTP Verification</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRegisterSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Full Legal Name (as per Aadhaar/PAN) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="citizen@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Government Identity (For 1-Citizen-1-Account Security)
                </label>
                <div className="flex gap-2">
                  <select
                    value={formData.govIdType}
                    onChange={(e) => setFormData({ ...formData, govIdType: e.target.value })}
                    className="w-1/3 px-3 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  >
                    <option value="aadhaar_last4">Aadhaar Last 4</option>
                    <option value="pan">PAN Card</option>
                    <option value="voter_id">Voter ID</option>
                  </select>
                  <input
                    type="text"
                    value={formData.govIdNumber}
                    onChange={(e) => setFormData({ ...formData, govIdNumber: e.target.value })}
                    placeholder={formData.govIdType === 'pan' ? 'ABCDE1234F' : 'Last 4 digits e.g. 5678'}
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Stored as a one-way cryptographic SHA-256 hash. Plain ID is never stored.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Password (Min 8 chars) *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                    />
                  </div>
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
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtpSubmit}
              className="space-y-5"
            >
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  A 6-digit one-time password has been generated for <strong>{formData.email}</strong>. Check your inbox or spam folder.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5 text-center">
                  Enter 6-Digit One-Time Password
                </label>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-center text-xl tracking-[0.3em] font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Activate Citizen Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResend}
                  className="text-xs text-saffron hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-royal-700 text-center space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-saffron hover:underline">
              Log in here
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strict One-Citizen-One-Account Enforcement Policy</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
