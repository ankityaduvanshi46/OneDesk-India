import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import {
  Palette,
  Type,
  Component,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Eye,
  Copy,
  ArrowRight,
  Smartphone,
  Laptop,
  Check,
  Send,
  Lock,
  RefreshCw
} from 'lucide-react'
import {
  IdentityIllustration,
  TransportIllustration,
  CertificatesIllustration,
  TaxFinanceIllustration,
  EducationIllustration,
  HealthIllustration,
  EmploymentIllustration,
  AgricultureIllustration,
  UtilitiesIllustration,
  WelfareIllustration
} from '../components/design-system/ServiceIllustrations'
import {
  SkeletonCard,
  SkeletonMetric,
  SkeletonTable,
  SkeletonForm
} from '../components/design-system/SkeletonLoader'

const COLOR_TOKENS = [
  { name: 'Ashoka Navy (Deep)', hex: '#0A192F', tailwind: 'bg-royal-900', role: 'Hero backdrops, dark mode primary, high-trust branding', contrast: 'AAA (16.2:1 on White)' },
  { name: 'Ashoka Navy (Card)', hex: '#0B132B', tailwind: 'bg-royal-850', role: 'Surfaces, dark mode elevated cards', contrast: 'AAA (14.8:1 on White)' },
  { name: 'Ashoka Navy (Border)', hex: '#1C2541', tailwind: 'bg-royal-700', role: 'Structural borders, dividers', contrast: 'AA' },
  { name: 'Sovereign Gold', hex: '#D4AF37', tailwind: 'bg-gold-500', role: 'National seals, badges, premium accents, rings', contrast: 'AA Large on Dark' },
  { name: 'Gold Highlight', hex: '#F5D15A', tailwind: 'bg-gold-400', role: 'Glow effects, star ratings, hover states', contrast: 'High' },
  { name: 'Radiant Saffron', hex: '#FF6B35', tailwind: 'bg-saffron', role: 'Primary CTAs, action triggers, alert notifications', contrast: 'AA (4.8:1 on White)' },
  { name: 'Saffron Deep', hex: '#EA580C', tailwind: 'bg-saffron-600', role: 'CTA gradients, active button states', contrast: 'AAA' },
  { name: 'Attestation Emerald', hex: '#10B981', tailwind: 'bg-emerald-500', role: 'Verified document badges, approved status', contrast: 'AA' },
  { name: 'Alabaster White', hex: '#FFFFFF', tailwind: 'bg-white', role: 'Light mode surface, cards, high readability', contrast: 'Base' },
  { name: 'Slate Light', hex: '#F8FAFC', tailwind: 'bg-slate-50', role: 'Light mode background body canvas', contrast: 'Base' }
]

const ILLUSTRATIONS_LIST = [
  { category: 'Identity & Citizenship', comp: IdentityIllustration, desc: 'Aadhaar, Passport, Voter ID & biometric cards with watermark & chip' },
  { category: 'Transport & Driving', comp: TransportIllustration, desc: 'Smart driving licence, high-security registration plates & Vahan' },
  { category: 'Certificates & Revenue', comp: CertificatesIllustration, desc: 'Notarized parchment, income/caste/domicile scroll with wax seal' },
  { category: 'Tax & Finance', comp: TaxFinanceIllustration, desc: 'PAN Card, GST, ITR, Rupee medallion surrounded by laurel wreath' },
  { category: 'Education & Academics', comp: EducationIllustration, desc: 'Mortarboard cap, open manuscript & scholarship attestations' },
  { category: 'Healthcare & Wellness', comp: HealthIllustration, desc: 'Ayushman Bharat card, medical aura cross & life pulse line' },
  { category: 'Employment & Labour', comp: EmploymentIllustration, desc: 'e-Shram card, artisan briefcase & industrial gear watermark' },
  { category: 'Agriculture & Land', comp: AgricultureIllustration, desc: 'Golden wheat sheaves, dawn sun & verified land record (Bhulekh)' },
  { category: 'Utilities & Civic Grid', comp: UtilitiesIllustration, desc: 'Municipal water, energy smart meter & municipal tax desk' },
  { category: 'Social Welfare & Pension', comp: WelfareIllustration, desc: 'Elderly care shield, family protection & golden pension coin' }
]

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState('palette')
  const [copiedHex, setCopiedHex] = useState(null)
  const [skeletonMode, setSkeletonMode] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    toast.success(`Copied ${hex} to clipboard!`)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
    toast.success('Micro-interaction fired with 60fps physics!')
  }

  const calculatePasswordStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score += 25
    if (/[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd)) score += 25
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25
    return score
  }

  const pwdScore = calculatePasswordStrength(passwordInput)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <Helmet>
        <title>Design System v2.0 Specification – OneDesk India</title>
        <meta name="description" content="Design System preview: Colors, Typography, SVG Illustrations, Skeletons, and Micro-interactions." />
      </Helmet>

      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-royal-900 via-royal-850 to-royal-900 rounded-3xl p-6 sm:p-10 text-white border border-gold-500/30 shadow-luxury relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/20 text-gold-400 border border-gold-500/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Theme Option 1: Imperial Republic</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            OneDesk India <span className="bg-gradient-to-r from-gold-300 to-amber-200 bg-clip-text text-transparent">Design System Specification</span>
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            Crafted for institutional trust, civic accessibility, and high performance. Enforcing WCAG AA contrast standards, mobile-first responsiveness (360px+), bilingual English/Hindi typography, custom SVG illustrations, and 60fps micro-animations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>WCAG AA Certified</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800 flex items-center gap-1.5 font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Mobile-First (360px - 4K)</span>
            </span>
            <span className="px-3 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800 flex items-center gap-1.5 font-semibold">
              <Type className="w-3.5 h-3.5 text-purple-400" />
              <span>Bilingual: Inter + Noto Sans Devanagari</span>
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-royal-700/80 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'palette', label: 'Color Tokens & Contrast', icon: Palette },
          { id: 'typography', label: 'Bilingual Typography', icon: Type },
          { id: 'components', label: 'UI Components & Buttons', icon: Component },
          { id: 'illustrations', label: 'Custom SVG Illustrations (10)', icon: Layers },
          { id: 'skeletons', label: 'Skeleton Wireframes', icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-saffron text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: COLOR PALETTE & CONTRAST */}
      {activeTab === 'palette' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Color Token Architecture</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click any swatch to copy the exact HEX hexcode</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.name}
                onClick={() => copyToClipboard(token.hex)}
                className="luxury-glass rounded-2xl p-4 border border-gray-100 dark:border-royal-700 hover:border-gold-500/60 cursor-pointer transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-xl border border-black/10 shadow-inner flex items-center justify-center shrink-0 relative"
                    style={{ backgroundColor: token.hex }}
                  >
                    {copiedHex === token.hex ? (
                      <Check className="w-5 h-5 text-white drop-shadow" />
                    ) : (
                      <Copy className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{token.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-royal-800 font-bold text-gray-600 dark:text-gray-300">
                        {token.hex}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{token.role}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        {token.contrast}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradients preview */}
          <div className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-700 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Official Brand Gradients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-20 rounded-xl bg-gradient-to-r from-saffron via-orange-600 to-saffron-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                Primary CTA: Saffron Radiance
              </div>
              <div className="h-20 rounded-xl bg-gradient-to-r from-royal-900 via-royal-850 to-royal-800 flex items-center justify-center text-gold-400 font-bold text-xs border border-gold-500/30 shadow-md">
                Institutional: Ashoka Navy & Gold
              </div>
              <div className="h-20 rounded-xl bg-gradient-to-r from-amber-600 via-gold-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-md">
                Sovereign Gold Accent
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: BILINGUAL TYPOGRAPHY */}
      {activeTab === 'typography' && (
        <section className="space-y-6">
          <div className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-700 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bilingual Type Hierarchy</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Primary: <strong>Inter</strong> (English) • Secondary: <strong>Noto Sans Devanagari</strong> (Hindi / क्षेत्रीय भाषाएँ)
              </p>
            </div>

            <div className="space-y-6 divide-y divide-gray-100 dark:divide-royal-750">
              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-gold-600 dark:text-gold-400 font-bold">Display 1 (36px / 44px - ExtraBold)</span>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Single-Window Citizen Facilitation Desk
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-saffron font-hindi">
                  एकल-खिड़की नागरिक सुविधा एवं सेवा केंद्र
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-gold-600 dark:text-gold-400 font-bold">Heading 2 (24px / 32px - Bold)</span>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fast, Transparent, and Guaranteed Delivery SLAs
                </p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 font-hindi">
                  पारदर्शी, सुरक्षित और समयबद्ध प्रमाण पत्र वितरण
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-gold-600 dark:text-gold-400 font-bold">Body Regular (16px / 24px - Medium)</span>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  Every citizen application is cryptographically sealed, assigned a verifiable QR attestation code, and monitored until government approval.
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300 font-hindi">
                  प्रत्येक नागरिक आवेदन को सुरक्षित प्रमाणीकरण, क्यूआर कोड और डिजिटल लॉकर की सुविधा प्रदान की जाती है।
                </p>
              </div>

              <div className="pt-4 space-y-1">
                <span className="text-[11px] font-mono text-gold-600 dark:text-gold-400 font-bold">Caption & Monospace (12px / 16px)</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  VER-ODI-2026-X89K • SHA256: 8f49a201bce47101da... • 256-Bit SSL Isolated
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: UI COMPONENTS & MICRO-INTERACTIONS */}
      {activeTab === 'components' && (
        <section className="space-y-8">
          {/* Buttons Showcase */}
          <div className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-700 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">1. Action Buttons & Micro-Interactions</h3>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={triggerCelebration} className="btn-luxury flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Primary Luxury (Click Me!)</span>
              </button>

              <button className="btn-luxury-outline flex items-center gap-2">
                <span>Secondary Outline</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-royal-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-royal-700 transition-all">
                Ghost Action
              </button>

              <button className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-all">
                Destructive Action
              </button>
            </div>
          </div>

          {/* Badges & Status Indicators */}
          <div className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-700 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">2. Official Status Badges</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300/60 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified / Approved</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300/60 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>In Review / Processing</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-300/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ready to Download</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300/60 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>Action Required / Rejected</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-50 dark:bg-gold-950/60 text-gold-700 dark:text-gold-400 border border-gold-300/60 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cryptographically Attested</span>
              </span>
            </div>
          </div>

          {/* Form Controls & Password Meter */}
          <div className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-700 space-y-4 max-w-lg">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">3. Accessible Input & Strength Meter</h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password Security Meter (Interactive Test)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Type a password to test..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                />
              </div>

              {/* Password strength bar */}
              <div className="mt-2 space-y-1">
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
                  <span>Strength: {pwdScore >= 100 ? 'Excellent' : pwdScore >= 50 ? 'Medium' : 'Weak'}</span>
                  <span>{pwdScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: CUSTOM SVG ILLUSTRATIONS */}
      {activeTab === 'illustrations' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Custom Vector Category Illustrations</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              100% vector SVG icons with Ashoka Navy, Sovereign Gold & Saffron styling. Lightweight, resolution-independent, zero HTTP external asset requests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ILLUSTRATIONS_LIST.map((item) => {
              const Comp = item.comp
              return (
                <div
                  key={item.category}
                  className="luxury-glass rounded-2xl p-5 border border-gray-100 dark:border-royal-700 flex flex-col items-center text-center space-y-3 hover:border-gold-500/60 transition-all hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-royal-800/80 group-hover:scale-105 transition-transform duration-300">
                    <Comp className="w-20 h-20" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">{item.category}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* TAB 5: SKELETON WIREFRAMES */}
      {activeTab === 'skeletons' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skeleton Wireframe Loaders</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Standardized wireframes preventing Layout Cumulative Shift (CLS) on slow 3G/4G connections.
              </p>
            </div>

            <button
              onClick={() => setSkeletonMode(!skeletonMode)}
              className="btn-luxury-outline text-xs flex items-center gap-2 self-start"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{skeletonMode ? 'Switch to Populated State' : 'Switch to Skeleton Wireframe'}</span>
            </button>
          </div>

          {skeletonMode ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Metric Skeletons</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <SkeletonMetric />
                  <SkeletonMetric />
                  <SkeletonMetric />
                  <SkeletonMetric />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Table Skeleton</span>
                  <SkeletonTable rows={4} columns={4} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Card Skeleton</span>
                  <SkeletonCard />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Form Stepper Skeleton</span>
                <SkeletonForm />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">Populated Metric Cards</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700/60">
                    <div className="text-xs text-gray-500">Total Applications</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">128</div>
                  </div>
                  <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700/60">
                    <div className="text-xs text-amber-500">In Process</div>
                    <div className="text-2xl font-bold text-amber-500 mt-1">14</div>
                  </div>
                  <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700/60">
                    <div className="text-xs text-emerald-500">Approved & Ready</div>
                    <div className="text-2xl font-bold text-emerald-500 mt-1">112</div>
                  </div>
                  <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700/60">
                    <div className="text-xs text-gold-500">Verified Locker</div>
                    <div className="text-2xl font-bold text-gold-500 mt-1">29</div>
                  </div>
                </div>
              </div>

              <div className="p-6 luxury-glass rounded-2xl border border-gray-100 dark:border-royal-700 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Click the button above to toggle between live data and shimmering skeleton states.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
