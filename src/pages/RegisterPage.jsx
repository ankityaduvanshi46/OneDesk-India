import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Check,
  AlertCircle
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { sanitizeReturnUrl } from '../utils/helpers'
import Logo from '../components/Logo'
import { IdentityIllustration } from '../components/design-system/ServiceIllustrations'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, verifyOtp, resendOtp, otpPendingEmail } = useAuthStore()

  const rawReturnUrl = searchParams.get('returnUrl') || '/dashboard'
  const targetDestination = sanitizeReturnUrl(rawReturnUrl, '/dashboard')

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

  // Password strength calculation
  const calculateStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd)) score += 25
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25
    return score
  }

  const pwdScore = calculateStrength(formData.password)

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
      navigate(targetDestination)
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
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <Helmet>
        <title>Citizen Account Registration – OneDesk India</title>
        <meta name="description" content="Register your verified OneDesk citizen account to access encrypted digital locker and service applications." />
      </Helmet>

      {/* Split Screen Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl luxury-glass rounded-3xl overflow-hidden border border-gray-100 dark:border-royal-750 shadow-luxury grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Side: Imperial Republic Value Showcase */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-royal-950 via-royal-900 to-royal-850 p-10 text-white flex-col justify-between relative overflow-hidden border-r border-royal-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Logo size="md" />

            <div className="pt-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 bg-gold-500/20 px-2.5 py-0.5 rounded-full border border-gold-500/30">
                Official Citizen Registration
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                One Citizen = One Account
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Create your verified profile once and reuse it across all 80+ state and central government service applications.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-royal-800/60 border border-gold-500/30 flex items-center gap-4">
              <div className="p-2 rounded-xl bg-royal-900 shrink-0">
                <IdentityIllustration className="w-12 h-12" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-gold-300">Identity Protection</div>
                <div className="text-[11px] text-gray-300 mt-0.5">
                  ID numbers are cryptographically salted and hashed. Plaintext IDs are never stored.
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Digital Document Locker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>QR Attestation Code on Issued Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time WhatsApp & SMS Progress Alerts</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-royal-800 text-[11px] text-gray-400 relative z-10 flex items-center justify-between">
            <span>256-Bit SSL Cryptographic Vault</span>
            <span className="text-emerald-400">DPDP 2023 Verified</span>
          </div>
        </div>

        {/* Right Side: Step 1 (Registration) or Step 2 (OTP Verification) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {step === 1 ? 'Citizen Account Registration' : 'Verify Email Address'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {step === 1
                  ? 'Fill your basic citizen profile details below'
                  : `Enter the 6-digit one-time passcode sent to ${formData.email}`}
              </p>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 1 ? 'text-gold-500' : 'text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Profile</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 dark:bg-royal-700" />
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step >= 2 ? 'text-gold-500' : 'text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>OTP Verification</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                      Full Legal Name (as on Aadhaar/PAN) *
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
                        placeholder="Enter your full legal name"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
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
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
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
                          placeholder="Enter 10-digit mobile number"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                      Citizen Verification ID (Aadhaar Last 4 / PAN)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.govIdType}
                        onChange={(e) => setFormData({ ...formData, govIdType: e.target.value })}
                        className="col-span-1 px-3 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs font-semibold focus:outline-none"
                      >
                        <option value="aadhaar_last4">Aadhaar (4 Digits)</option>
                        <option value="pan">PAN Card</option>
                        <option value="voter_id">Voter ID</option>
                      </select>
                      <input
                        type="text"
                        value={formData.govIdNumber}
                        onChange={(e) => setFormData({ ...formData, govIdNumber: e.target.value.toUpperCase() })}
                        placeholder={formData.govIdType === 'aadhaar_last4' ? 'Last 4 digits (optional)' : 'ID number (optional)'}
                        className="col-span-2 px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      />
                    </div>
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
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
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
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="space-y-1 pt-1">
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-royal-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pwdScore <= 25
                              ? 'bg-red-500 w-1/4'
                              : pwdScore <= 50
                              ? 'bg-amber-500 w-2/4'
                              : pwdScore <= 75
                              ? 'bg-blue-500 w-3/4'
                              : 'bg-emerald-500 w-full'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
                        <span>Strength: {pwdScore >= 100 ? 'Strong' : pwdScore >= 50 ? 'Medium' : 'Weak'}</span>
                        <span>{pwdScore}%</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-bold"
                  >
                    {submitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue to OTP Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleVerifyOtpSubmit}
                  className="space-y-5"
                >
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      A 6-digit one-time passcode has been generated for <strong>{formData.email}</strong>. Check your inbox or spam folder.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2 text-center">
                      Enter 6-Digit One-Time Password
                    </label>
                    <div className="relative max-w-xs mx-auto">
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full py-3 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-center text-2xl tracking-[0.3em] font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-bold"
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

            <div className="pt-4 border-t border-gray-100 dark:border-royal-750 text-center space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Already registered?{' '}
                <Link
                  to={searchParams.get('returnUrl') ? `/login?returnUrl=${encodeURIComponent(searchParams.get('returnUrl'))}` : '/login'}
                  className="font-bold text-saffron hover:underline"
                >
                  Log in here
                </Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Strict One-Citizen-One-Account Enforcement Policy</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
