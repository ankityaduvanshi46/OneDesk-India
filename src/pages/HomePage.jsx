import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  QrCode,
  Lock,
  ChevronDown,
  Star,
  Users,
  Compass,
  AlertCircle
} from 'lucide-react'
import HeroSection from '../components/HeroSection'
import CategoryChips from '../components/CategoryChips'
import StateSelector from '../components/StateSelector'
import ServiceCard from '../components/ServiceCard'
import AddServiceModal from '../components/AddServiceModal'
import { TRENDING_SERVICES } from '../data/services'
import { useAppStore } from '../store/useAppStore'
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

const SECTOR_SHOWCASE = [
  { name: 'Identity & Cards', cat: 'identity', comp: IdentityIllustration, count: '12 Portals' },
  { name: 'Transport & Driving', cat: 'transport', comp: TransportIllustration, count: '14 Portals' },
  { name: 'Certificates & Revenue', cat: 'certificates', comp: CertificatesIllustration, count: '18 Portals' },
  { name: 'Tax & Finance', cat: 'taxes', comp: TaxFinanceIllustration, count: '10 Portals' },
  { name: 'Education & Grants', cat: 'education', comp: EducationIllustration, count: '8 Portals' },
  { name: 'Healthcare & ABHA', cat: 'health', comp: HealthIllustration, count: '9 Portals' },
  { name: 'Employment & Shram', cat: 'employment', comp: EmploymentIllustration, count: '7 Portals' },
  { name: 'Land & Agriculture', cat: 'agriculture', comp: AgricultureIllustration, count: '11 Portals' }
]

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Select Official Service',
    titleHi: 'आधिकारिक सेवा चुनें',
    desc: 'Browse 80+ state and central portals. Directly link to verified .gov.in domains or apply through OneDesk single-window hub.',
    descHi: '80+ राज्य और केंद्र सरकार के पोर्टल देखें। सत्यापित .gov.in पोर्टल पर जाएं या वनडेस्क के माध्यम से सीधे आवेदन करें।'
  },
  {
    step: '02',
    title: 'Guided Verification & Upload',
    titleHi: 'दस्तावेज़ सत्यापन एवं सबमिशन',
    desc: 'Submit required documents with automatic validation. No missing paperwork, blurred files, or application rejections.',
    descHi: 'आवश्यक दस्तावेज़ सुरक्षित रूप से अपलोड करें। बिना किसी त्रुटि या अस्वीकृति के त्वरित प्रक्रिया।'
  },
  {
    step: '03',
    title: 'Cryptographic Delivery & Locker',
    titleHi: 'डिजिटल लॉकर एवं क्यूआर सत्यापन',
    desc: 'Receive official certificates with tamper-proof QR code attestations stored permanently in your citizen digital locker.',
    descHi: 'आधिकारिक क्यूआर कोड के साथ डिजिटल प्रमाण पत्र सीधे आपके लॉकर में सुरक्षित रूप से वितरित किए जाते हैं।'
  }
]

const CITIZEN_REVIEWS = [
  {
    name: 'Rajesh K. Sharma',
    city: 'Lucknow, Uttar Pradesh',
    service: 'Income Certificate',
    rating: 5,
    comment: 'Applied for an urgent scholarship income certificate. Got real-time SMS alerts and downloaded my verified PDF within 4 days. Zero hassle!'
  },
  {
    name: 'Priya Sundaram',
    city: 'Bengaluru, Karnataka',
    service: 'Driving Licence Slot',
    rating: 5,
    comment: 'The official Parivahan portal was confusing, but OneDesk guided me through slot booking and document preparation in 10 minutes.'
  },
  {
    name: 'Amitabh Sen',
    city: 'Kolkata, West Bengal',
    service: 'PAN Card Correction',
    rating: 5,
    comment: 'Saved me from a scam website! The domain check showed the exact NSDL portal. Truly trustworthy service for common citizens.'
  }
]

const FAQS = [
  {
    q: 'Is OneDesk India an official government website?',
    a: 'No. OneDesk India is a private citizen facilitation platform and independent directory. We provide verified direct links to official government portals (.gov.in and .nic.in) and offer digital documentation assistance. We are not a government agency.'
  },
  {
    q: 'How does OneDesk protect my sensitive citizen documents?',
    a: 'We adhere to the Digital Personal Data Protection (DPDP) Act 2023. All file uploads are stored with 256-bit AES encryption in private, non-public cloud buckets with signed expiring access links. We never store plain Aadhaar numbers or sell data.'
  },
  {
    q: 'How does the Cryptographic QR Document Verification work?',
    a: 'Every certificate facilitated through OneDesk carries an official SHA-256 verification signature and QR code. Anyone (colleges, employers, authorities) can scan the QR code to verify the document authenticity at /verify-document.'
  },
  {
    q: 'What fees are charged on OneDesk?',
    a: 'Accessing the directory, verifying government links, and checking domains is 100% free. For premium end-to-end facilitation, transparent facilitator fees are clearly disclosed before checkout, along with official government fees.'
  }
]

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const { selectedState, getAllServices } = useAppStore()
  const [activeCategory, setActiveCategory] = useState('all')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const allServices = getAllServices()
  const lang = i18n.language

  const trendingServices = useMemo(() => {
    return TRENDING_SERVICES.map((id) => allServices.find((s) => s.id === id)).filter(Boolean)
  }, [allServices])

  const filteredServices = useMemo(() => {
    let list = [...allServices]
    if (activeCategory !== 'all') {
      list = list.filter((s) => s.category === activeCategory)
    }
    if (selectedState) {
      list.sort((a, b) => {
        if (a.state === selectedState && b.state !== selectedState) return -1
        if (b.state === selectedState && a.state !== selectedState) return 1
        return 0
      })
    }
    return list
  }, [allServices, activeCategory, selectedState])

  return (
    <div className="space-y-16">
      <Helmet>
        <title>{t('siteName')} – Unified Indian Citizen Facilitation & Government Services Hub</title>
        <meta
          name="description"
          content="OneDesk India: Premium single-window directory of direct links to 80+ official Indian government service portals. Guaranteed verified official domains."
        />
      </Helmet>

      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* SECTION 1: Sector Showcase Grid with Custom SVG Illustrations */}
        <section aria-labelledby="sector-showcase-heading" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
              Directory Sectors
            </span>
            <h2 id="sector-showcase-heading" className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Explore Government Services by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Curated official gateways across central ministries and all 28 states & 8 union territories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {SECTOR_SHOWCASE.map((item) => {
              const Comp = item.comp
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveCategory(item.cat)}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all hover:-translate-y-1 ${
                    activeCategory === item.cat
                      ? 'border-saffron bg-saffron/10 dark:bg-royal-800 shadow-md ring-2 ring-saffron/30'
                      : 'border-gray-100 dark:border-royal-750 bg-white dark:bg-royal-850 hover:border-gold-500/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-50 dark:bg-royal-800">
                    <Comp className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[11px] text-gray-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 block">
                      {item.count}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* SECTION 2: Trending Quick Services */}
        <section aria-labelledby="trending-heading">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <h2 id="trending-heading" className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('search.trending')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Most requested citizen services this week</p>
              </div>
            </div>
            <Link to="/services" className="text-xs font-bold text-saffron hover:underline flex items-center gap-1">
              <span>{t('hero.cta')}</span>
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingServices.slice(0, 5).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </section>

        {/* SECTION 3: Illustrated "How It Works" 3-Step Stepper */}
        <section className="bg-gradient-to-r from-royal-900 via-royal-850 to-royal-900 text-white rounded-3xl p-6 sm:p-12 border border-gold-500/30 shadow-luxury-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-gold-500/20 px-3 py-1 rounded-full border border-gold-500/30">
                Transparent Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                How OneDesk Facilitation Works
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Simple, compliant, and tracked from initial submission to final certificate delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS_STEPS.map((step, idx) => (
                <div
                  key={step.step}
                  className="bg-royal-800/60 p-6 rounded-2xl border border-royal-700/60 space-y-3 relative hover:border-gold-500/50 transition-all hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-base text-white">
                    {lang === 'hi' ? step.titleHi : step.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {lang === 'hi' ? step.descHi : step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link
                to="/apply"
                className="btn-luxury inline-flex items-center gap-2 text-xs sm:text-sm px-8 py-3.5 font-bold shadow-glow-saffron"
              >
                <span>Start Your Application Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: Complete Directory with Filter Chips & State Selector */}
        <section aria-labelledby="directory-heading" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-royal-800">
            <div>
              <h2 id="directory-heading" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🏛️</span>
                <span>All Government Portals & Facilitation Desks</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {filteredServices.length} {t('search.results')} • Sorted by relevance & state selection
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn-luxury-outline text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Auto-Add Portal</span>
              </button>
              <StateSelector />
            </div>
          </div>

          <CategoryChips activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* SECTION 5: Citizen Trust Stories / Testimonials */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300/40">
              Verified Citizen Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Trusted by Citizens Across India
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Real citizens sharing their experience with OneDesk digital document delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CITIZEN_REVIEWS.map((rev) => (
              <div
                key={rev.name}
                className="luxury-glass rounded-2xl p-6 border border-gray-100 dark:border-royal-750 space-y-3 hover:border-gold-500/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 text-gold-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="pt-3 border-t border-gray-100 dark:border-royal-750 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white">{rev.name}</h4>
                    <p className="text-[10px] text-gray-400">{rev.city}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/40">
                    {rev.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Frequently Asked Questions Accordion */}
        <section className="luxury-glass rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-royal-750 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Clear, transparent answers about our facilitation service and citizen safety.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 dark:border-royal-700 overflow-hidden bg-white/50 dark:bg-royal-850/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-royal-800 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-saffron' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4.5 pt-0 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-royal-750"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {addModalOpen && (
          <AddServiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
