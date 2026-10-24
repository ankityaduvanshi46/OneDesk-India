import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
  Search,
  Lock,
  Compass
} from 'lucide-react'
import SearchBar from './SearchBar'
import { useAppStore } from '../store/useAppStore'
import { CATEGORIES, STATES } from '../data/services'

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const { getAllServices } = useAppStore()
  const lang = i18n.language

  const totalServices = getAllServices().length

  const stats = [
    { value: `${totalServices}+`, label: 'Verified Portals', labelHi: 'सत्यापित पोर्टल', icon: '🏛️' },
    { value: '28+8', label: 'States & UTs Covered', labelHi: 'राज्य एवं केंद्र शासित', icon: '🇮🇳' },
    { value: '100%', label: 'Free Facilitation Access', labelHi: 'निःशुल्क नागरिक सुविधा', icon: '⚡' },
    { value: '< 15m', label: 'Processing SLA Target', labelHi: 'त्वरित सहायता', icon: '⏱️' }
  ]

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-orange-50/60 via-slate-50 to-white dark:from-royal-950 dark:via-royal-900 dark:to-royal-900 border-b border-gray-100 dark:border-royal-800 transition-colors">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,107,53,0.18),rgba(212,175,55,0.12),transparent)] pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Headline, Value Proposition & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-royal-800 border border-gold-500/35 shadow-sm text-xs font-bold text-gray-800 dark:text-gold-300 backdrop-blur-md"
            >
              <span className="text-sm">🇮🇳</span>
              <span>{lang === 'hi' ? 'एकीकृत राष्ट्रीय सरकारी सेवा पोर्टल एवं सहायता डेस्क' : 'Unified National Directory & Facilitation Desk'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 dark:text-white tracking-tight leading-[1.12]"
            >
              {lang === 'hi' ? (
                <>
                  प्रत्येक सरकारी सेवा{' '}
                  <span className="bg-gradient-to-r from-saffron via-orange-500 to-gold-500 bg-clip-text text-transparent">
                    सीधे, पारदर्शी और सत्यापित
                  </span>
                </>
              ) : (
                <>
                  Access Indian Public Services with{' '}
                  <span className="bg-gradient-to-r from-saffron via-orange-500 to-gold-500 bg-clip-text text-transparent">
                    Total Trust & Direct Speed
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {lang === 'hi'
                ? 'आधार, ड्राइविंग लाइसेंस, पैन कार्ड, आय और जाति प्रमाण पत्र के लिए एकल खिड़की सुविधा। सीधे सत्यापित लिंक, क्यूआर सत्यापन और सुरक्षित डिजिटल लॉकर।'
                : 'One-stop facilitation for Aadhaar, Driving Licence, PAN Card, Income & Caste Certificates. Verified direct links, cryptographic QR attestation, and private document locker.'}
            </motion.p>

            {/* Live Autocomplete Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl mx-auto lg:mx-0 shadow-2xl rounded-2xl relative"
            >
              <SearchBar />
            </motion.div>

            {/* Quick Action Triggers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <Link
                to="/apply"
                className="btn-luxury flex items-center gap-2 text-xs sm:text-sm px-6 py-3 font-bold shadow-lg"
              >
                <span>{lang === 'hi' ? '⚡ ऑनलाइन आवेदन करें' : '⚡ Apply Online (Hub)'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/wizard"
                className="btn-luxury-outline flex items-center gap-2 text-xs sm:text-sm px-6 py-3 font-semibold"
              >
                <Compass className="w-4 h-4 text-gold-500" />
                <span>{lang === 'hi' ? 'मार्गदर्शित सेवा विज़ार्ड' : 'Guided Service Wizard'}</span>
              </Link>
              <Link
                to="/verify-document"
                className="px-4 py-3 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>{lang === 'hi' ? 'दस्तावेज़ क्यूआर सत्यापन' : 'Verify QR Attestation'}</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Spam Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Lock className="w-4 h-4 text-blue-500" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>100% Official .gov.in URLs</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Animated Citizen Portal Mockup */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto max-w-md w-full"
            >
              {/* Decorative Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-saffron via-gold-500 to-amber-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-white dark:bg-royal-850 rounded-3xl p-6 border border-gray-100 dark:border-gold-500/30 shadow-luxury dark:shadow-luxury-dark space-y-4">
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-royal-750">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-gray-400 ml-2">onedesk.in/citizen-desk</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300/40">
                    Active Session
                  </span>
                </div>

                {/* Simulated Certificate Preview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-royal-900 to-royal-850 text-white border border-gold-500/40 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold">
                        Issued Digital Certificate
                      </span>
                      <h4 className="font-bold text-sm text-white mt-0.5">
                        Income & Asset Certificate
                      </h4>
                      <p className="text-[10px] text-gray-300">Revenue Dept. Government of India</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/10 text-gold-400 border border-gold-500/30">
                      <QrCode className="w-7 h-7" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-royal-700/60">
                    <div>
                      <span className="text-gray-400">Citizen:</span>
                      <p className="font-semibold text-white">Ankit Yadav</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Verification ID:</span>
                      <p className="font-mono text-gold-300">VER-ODI-2026-X89K</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Cryptographically Sealed</span>
                    </span>
                    <span className="text-[10px] text-gray-400">256-bit AES</span>
                  </div>
                </div>

                {/* Live Status Tracker Micro-interaction */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white">
                    <span>Application Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Approved & Ready</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs">Form submitted & e-Signed</span>
                      <span className="ml-auto text-[10px] text-gray-400">Oct 24</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-xs">Officer verification verified</span>
                      <span className="ml-auto text-[10px] text-gray-400">Oct 24</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-bold">
                        ⚡
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold text-xs">Delivered to Document Locker</span>
                      <span className="ml-auto text-[10px] text-emerald-500 font-bold">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Real-time Stats Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-royal-850/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gold-500/20 shadow-luxury dark:shadow-luxury-dark text-center hover:border-gold-500/50 transition-all hover:-translate-y-1"
            >
              <div className="text-2xl mb-1" aria-hidden="true">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                {lang === 'hi' ? stat.labelHi : stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
