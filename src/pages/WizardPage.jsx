import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import SEOHead from '../components/SEOHead'
import { useAppStore } from '../store/useAppStore'
import ServiceCard from '../components/ServiceCard'

const WIZARD_STEPS = [
  {
    id: 'category',
    title: 'What do you want help with today?',
    titleHi: 'आज आप किस चीज़ में मदद चाहते हैं?',
    subtitle: 'Select the main area that fits your requirement',
    options: [
      { id: 'identity', icon: '🪪', label: 'Identity & Cards', labelHi: 'पहचान और कार्ड', desc: 'Aadhaar, PAN, Voter ID, Passport, DigiLocker' },
      { id: 'transport', icon: '🚗', label: 'Driving & Vehicles', labelHi: 'ड्राइविंग और वाहन', desc: 'Driving licence, vehicle RC, challan, FASTag' },
      { id: 'certificates', icon: '📜', label: 'Certificates & e-District', labelHi: 'प्रमाण पत्र और ई-डिस्ट्रिक्ट', desc: 'Income, caste, domicile, birth, marriage, EWS' },
      { id: 'tax-finance', icon: '💰', label: 'Taxes, Pension & Money', labelHi: 'कर, पेंशन और पैसा', desc: 'ITR e-filing, GST, EPFO PF, NPS, PM Kisan' },
      { id: 'education', icon: '🎓', label: 'Education & Exams', labelHi: 'शिक्षा और परीक्षाएं', desc: 'Scholarships, CBSE, NTA JEE/NEET, SWAYAM' },
      { id: 'health', icon: '🏥', label: 'Healthcare & Insurance', labelHi: 'स्वास्थ्य और बीमा', desc: 'Ayushman Bharat card, ABHA ID, eSanjeevani' },
      { id: 'jobs', icon: '💼', label: 'Government Jobs', labelHi: 'सरकारी नौकरियां', desc: 'UPSC, SSC, Railway recruitment, National Career Service' },
      { id: 'land-property', icon: '🏠', label: 'Land & Property Records', labelHi: 'जमीन और संपत्ति', desc: 'Bhulekh, mutation, registry, RERA verification' },
      { id: 'grievance', icon: '📢', label: 'File Complaint or RTI', labelHi: 'शिकायत या RTI दर्ज करें', desc: 'CPGRAMS grievance, RTI online filing, eCourts' }
    ]
  },
  {
    id: 'subgoal',
    title: 'What specific task are you trying to accomplish?',
    titleHi: 'आप क्या विशिष्ट कार्य करना चाहते हैं?',
    subtitle: 'Choose your immediate goal',
    optionsByCategory: {
      identity: [
        { id: 'aadhaar-new-update', label: 'Download, verify or update Aadhaar card', serviceIds: ['aadhaar', 'digilocker'] },
        { id: 'pan-apply', label: 'Apply for new PAN card or link Aadhaar', serviceIds: ['pan-card', 'pan-nsdl', 'pan-utiitsl'] },
        { id: 'voter-card', label: 'Register as new voter or download e-EPIC', serviceIds: ['voter-id'] },
        { id: 'passport-apply', label: 'Apply for fresh passport or renewal', serviceIds: ['passport'] },
        { id: 'ration-family', label: 'Apply for or check ration card', serviceIds: ['ration-card', 'jan-aadhaar', 'samagra-id'] }
      ],
      transport: [
        { id: 'dl-apply', label: 'Apply for Learner Licence (LL) or Driving Licence (DL)', serviceIds: ['driving-licence'] },
        { id: 'rc-check', label: 'Vehicle registration, transfer or RC download', serviceIds: ['vehicle-rc', 'digilocker'] },
        { id: 'challan-pay', label: 'Check and pay traffic e-challan online', serviceIds: ['traffic-challan'] },
        { id: 'fastag-buy', label: 'FASTag recharge or buy new FASTag', serviceIds: ['fasttag'] }
      ],
      certificates: [
        { id: 'income-cert', label: 'Get income certificate for scholarship or admission', serviceIds: ['income-certificate', 'ews-certificate'] },
        { id: 'caste-cert', label: 'Get SC/ST/OBC caste certificate', serviceIds: ['caste-certificate'] },
        { id: 'domicile-cert', label: 'Get residence / domicile certificate', serviceIds: ['domicile-certificate'] },
        { id: 'vital-cert', label: 'Get birth, death, or marriage certificate', serviceIds: ['birth-certificate', 'death-certificate', 'marriage-certificate'] }
      ],
      'tax-finance': [
        { id: 'itr-file', label: 'File Income Tax Return (ITR) or check refund', serviceIds: ['income-tax', 'pan-card'] },
        { id: 'pf-check', label: 'Check EPFO PF balance or withdraw provident fund', serviceIds: ['epfo', 'umang'] },
        { id: 'gst-portal', label: 'Register for GST or file monthly GST returns', serviceIds: ['gst'] },
        { id: 'farmer-money', label: 'Get PM Kisan Rs. 6000 or Kisan Credit Card', serviceIds: ['pm-kisan', 'kcc'] },
        { id: 'pension-plan', label: 'Open NPS retirement account or Atal Pension Yojana', serviceIds: ['nps', 'atal-pension'] }
      ],
      education: [
        { id: 'scholarship-apply', label: 'Apply for National Scholarship Portal (NSP)', serviceIds: ['nsp', 'digilocker'] },
        { id: 'exam-reg', label: 'Register for JEE, NEET, or CUET entrance exam', serviceIds: ['nta', 'nta-cuet'] },
        { id: 'board-marks', label: 'Download CBSE marksheet or check board result', serviceIds: ['cbse', 'digilocker'] },
        { id: 'free-courses', label: 'Learn free online courses from IITs/IIMs', serviceIds: ['swayam', 'diksha'] }
      ],
      health: [
        { id: 'ayushman-apply', label: 'Get free Rs. 5 Lakh health insurance card', serviceIds: ['ayushman-bharat', 'ayushman-card', 'ayushman-mitra'] },
        { id: 'abha-make', label: 'Create 14-digit digital health ID (ABHA)', serviceIds: ['abha-id'] },
        { id: 'tele-doc', label: 'Free online doctor consultation from home', serviceIds: ['esanjeevani'] }
      ],
      jobs: [
        { id: 'upsc-apply', label: 'Civil Services / IAS / IPS examination', serviceIds: ['upsc'] },
        { id: 'ssc-apply', label: 'Staff Selection Commission (CGL, CHSL, MTS)', serviceIds: ['ssc'] },
        { id: 'railway-job', label: 'Indian Railways recruitment (RRB NTPC, Group D)', serviceIds: ['railway-recruitment'] },
        { id: 'ncs-search', label: 'Private & public job vacancies across India', serviceIds: ['ncs', 'rojgar-sangam'] }
      ],
      'land-property': [
        { id: 'bhulekh-view', label: 'Check Khasra, Khatauni & land ownership online', serviceIds: ['bhulekh'] },
        { id: 'mutation-apply', label: 'Apply for land mutation (Dakhil Kharij)', serviceIds: ['land-mutation'] },
        { id: 'property-reg', label: 'Property registry & stamp duty booking', serviceIds: ['doris'] },
        { id: 'rera-verify', label: 'Verify builder / flat project with RERA', serviceIds: ['rera'] }
      ],
      grievance: [
        { id: 'govt-complaint', label: 'File complaint against central government ministry', serviceIds: ['cpgrams'] },
        { id: 'rti-file', label: 'File Right to Information (RTI) online for Rs. 10', serviceIds: ['rtionline'] },
        { id: 'court-track', label: 'Check status of pending court case', serviceIds: ['e-courts'] }
      ]
    }
  }
]

export default function WizardPage() {
  const { t, i18n } = useTranslation()
  const { getAllServices } = useAppStore()
  const lang = i18n.language

  const allServices = getAllServices()

  const [stepIndex, setStepIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [recommendedIds, setRecommendedIds] = useState([])

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId)
    setStepIndex(1)
  }

  const handleSelectSubgoal = (serviceIds) => {
    setRecommendedIds(serviceIds)
    setStepIndex(2)
  }

  const handleRestart = () => {
    setStepIndex(0)
    setSelectedCategory(null)
    setRecommendedIds([])
  }

  const recommendedServices = recommendedIds
    .map((id) => allServices.find((s) => s.id === id))
    .filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <SEOHead
        title="What Do I Need? – Guided Assistant"
        description="Step-by-step smart questionnaire to find the exact Indian government portal and documents you need on OneDesk India."
        canonical="/wizard"
      />

      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-300 text-xs font-semibold border border-gold-500/30">
          <span>🧭</span>
          <span>Guided Government Service Finder</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white">
          {t('wizard.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {t('wizard.subtitle')}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              stepIndex >= i ? 'bg-gradient-to-r from-saffron to-gold-500' : 'bg-gray-200 dark:bg-royal-800'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {stepIndex === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lang === 'hi' ? WIZARD_STEPS[0].titleHi : WIZARD_STEPS[0].title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{WIZARD_STEPS[0].subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {WIZARD_STEPS[0].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectCategory(opt.id)}
                  className="p-5 rounded-2xl luxury-glass hover:border-gold-500/60 transition-all text-left flex flex-col gap-2 group hover:scale-[1.02]"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                  <div className="font-bold text-base text-gray-900 dark:text-white">
                    {lang === 'hi' && opt.labelHi ? opt.labelHi : opt.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {stepIndex === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStepIndex(0)}
                className="text-xs font-semibold text-gray-500 hover:text-brand-primary flex items-center gap-1"
              >
                ← {t('wizard.back')}
              </button>
              <span className="text-xs text-gray-400 font-medium">Step 2 of 2</span>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lang === 'hi' ? WIZARD_STEPS[1].titleHi : WIZARD_STEPS[1].title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">{WIZARD_STEPS[1].subtitle}</p>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              {(WIZARD_STEPS[1].optionsByCategory[selectedCategory] || []).map((subopt) => (
                <button
                  key={subopt.id}
                  onClick={() => handleSelectSubgoal(subopt.serviceIds)}
                  className="w-full p-4 rounded-2xl luxury-glass hover:border-gold-500/60 transition-all text-left flex items-center justify-between gap-4 shadow-sm group hover:scale-[1.01]"
                >
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {subopt.label}
                  </span>
                  <span className="text-brand-primary text-sm font-bold group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {stepIndex === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
              >
                🔄 {t('wizard.restart')}
              </button>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span>✓</span>
                <span>Recommendations Ready</span>
              </span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {t('wizard.results')}
              </h2>
              <p className="text-xs text-gray-500">
                Direct official portals matching your requirement
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommendedServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
