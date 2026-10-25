import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  KeyRound
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { sanitizeReturnUrl } from '../utils/helpers'
import { trackRegistrationInitiated, trackRegistrationCompleted } from '../utils/analytics'
import Logo from '../components/Logo'
import OtpInput from '../components/OtpInput'
import { IdentityIllustration } from '../components/design-system/ServiceIllustrations'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { sendOtp, verifyOtp } = useAuthStore()

  const rawReturnUrl = searchParams.get('returnUrl') || '/dashboard'
  const targetDestination = sanitizeReturnUrl(rawReturnUrl, '/dashboard')

  // Steps: 'details' | 'otp'
  const [step, setStep] = useState('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  function startCountdown() {
    setCountdown(60)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── Step 1: Send OTP ────────────────────────────────────────────────────────
  async function handleSendOtp(e) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2) {
      toast.error('Please enter your full name (at least 2 characters).')
      return
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    try {
      setSendingOtp(true)
      setErrorMsg('')
      trackRegistrationInitiated()
      await sendOtp({ email: cleanEmail, name: cleanName, type: 'register' })
      setStep('otp')
      startCountdown()
      toast.success('OTP sent! Check your email inbox.')
    } catch (err) {
      toast.error(err.message || 'Could not send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (otpValue.length < 6) {
      setOtpError(true)
      setErrorMsg('Please enter all 6 digits of the OTP.')
      return
    }
    try {
      setVerifying(true)
      setOtpError(false)
      setErrorMsg('')
      const user = await verifyOtp({
        email: email.trim().toLowerCase(),
        code: otpValue,
        type: 'register',
        name: name.trim()
      })
      trackRegistrationCompleted()
      toast.success(`Welcome to OneDesk India, ${user.name}!`)
      navigate(targetDestination, { replace: true })
    } catch (err) {
      setOtpError(true)
      const msg = err.message || 'Incorrect or expired OTP.'
      setErrorMsg(msg)
      toast.error(msg)
      setOtpValue('')
    } finally {
      setVerifying(false)
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  async function handleResend() {
    if (countdown > 0) return
    try {
      setSendingOtp(true)
      setErrorMsg('')
      setOtpError(false)
      setOtpValue('')
      await sendOtp({ email: email.trim().toLowerCase(), name: name.trim(), type: 'register' })
      startCountdown()
      toast.success('A new OTP has been sent to your email.')
    } catch (err) {
      toast.error(err.message || 'Could not resend OTP.')
    } finally {
      setSendingOtp(false)
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <Helmet>
        <title>Citizen Registration – OneDesk India</title>
        <meta name="description" content="Create your OneDesk India citizen account — no password required. Just your name, email, and a one-time verification code." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl luxury-glass rounded-3xl overflow-hidden border border-gray-100 dark:border-royal-750 shadow-luxury grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Left Side: Brand */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40 dark:from-royal-950 dark:via-royal-900 dark:to-royal-850 p-10 text-gray-900 dark:text-white flex-col justify-between relative overflow-hidden border-r border-gray-200 dark:border-royal-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Logo size="md" />

            <div className="pt-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 dark:text-gold-300 bg-amber-100 dark:bg-gold-500/20 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-gold-500/30">
                New Citizen Registration
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Join the OneDesk Citizen Hub
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                Register in seconds — just your name and email. No passwords, no friction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-royal-800/60 border border-gray-200 dark:border-gold-500/30 shadow-sm flex items-center gap-4">
              <div className="p-2 rounded-xl bg-gray-50 dark:bg-royal-900 border border-gray-100 dark:border-royal-700 shrink-0">
                <IdentityIllustration className="w-12 h-12" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-gray-900 dark:text-gold-300">Passwordless & Secure</div>
                <div className="text-[11px] text-gray-700 dark:text-gray-300 mt-0.5 font-medium">
                  A 6-digit OTP sent to your email creates your account instantly.
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-800 dark:text-gray-200 font-medium pt-2">
              {[
                'Free for all Indian citizens',
                'DPDP Act 2023 compliant data handling',
                'Secure digital locker for your documents'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-royal-800 text-[11px] text-gray-700 dark:text-gray-400 font-semibold relative z-10 flex items-center justify-between">
            <span>DPDP Act 2023 Compliant</span>
            <span className="text-saffron-700 dark:text-gold-400 font-bold">Ver. 2.0</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {step === 'details' ? (
                <motion.div
                  key="details-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Create Citizen Account
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      Enter your details below. We'll send a one-time password to verify your email.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          minLength={2}
                          maxLength={80}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full legal name"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                          autoFocus
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      You can add your mobile number and other details from the Profile section after signing in.
                    </p>

                    <button
                      type="submit"
                      disabled={sendingOtp}
                      className="w-full mt-2 btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-bold"
                    >
                      {sendingOtp ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send OTP to Verify Email</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <KeyRound className="w-5 h-5 text-gold-500" />
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Verify Your Email
                      </h1>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      A 6-digit code was sent to{' '}
                      <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                      Enter it below to create your account. Valid for 5 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <OtpInput
                      value={otpValue}
                      onChange={(v) => { setOtpValue(v); setOtpError(false); setErrorMsg('') }}
                      disabled={verifying}
                      error={otpError}
                    />

                    {errorMsg && (
                      <p className="text-center text-sm text-red-500 font-medium">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={verifying || otpValue.length < 6}
                      className="w-full btn-luxury flex items-center justify-center gap-2 py-3 disabled:opacity-50 font-bold"
                    >
                      {verifying ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Account & Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Resend */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={countdown > 0 || sendingOtp}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {countdown > 0 ? `Resend OTP in ${countdown}s` : sendingOtp ? 'Sending…' : 'Resend OTP'}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => { setStep('details'); setOtpValue(''); setErrorMsg(''); setOtpError(false) }}
                        className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                      >
                        ← Go back and edit details
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-gray-100 dark:border-royal-750 text-center space-y-3">
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Already have an account?{' '}
                <Link
                  to={searchParams.get('returnUrl') ? `/login?returnUrl=${encodeURIComponent(searchParams.get('returnUrl'))}` : '/login'}
                  className="font-bold text-saffron hover:underline"
                >
                  Sign in here
                </Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 font-medium">
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
