import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'
import { STATES } from '../data/services'

const POPULAR_SERVICES = [
  { id: 'income-cert', name: 'Income Certificate (आय प्रमाण पत्र)', category: 'Certificates', fee: '₹50 Govt Fee', time: '3 to 7 working days' },
  { id: 'caste-cert', name: 'Caste Certificate (जाति प्रमाण पत्र)', category: 'Certificates', fee: '₹50 Govt Fee', time: '7 to 15 working days' },
  { id: 'domicile-cert', name: 'Domicile / Residence Certificate (निवास प्रमाण पत्र)', category: 'Certificates', fee: '₹50 Govt Fee', time: '5 to 10 working days' },
  { id: 'birth-cert', name: 'Birth Certificate Registration (जन्म प्रमाण पत्र)', category: 'Certificates', fee: 'Free / ₹20', time: '7 working days' },
  { id: 'driving-licence', name: 'Driving Licence Assistance (ड्राइविंग लाइसेंस)', category: 'Transport', fee: '₹200 to ₹500', time: 'Slot dependent' },
  { id: 'pan-card', name: 'PAN Card New / Correction Assistance (पैन कार्ड)', category: 'Tax & Finance', fee: '₹107 NSDL Fee', time: '10 to 15 days' },
  { id: 'ration-card', name: 'Ration Card Application / Addition (राशन कार्ड)', category: 'Identity', fee: 'Free / ₹30', time: '15 to 30 days' },
  { id: 'senior-pension', name: 'Old Age / Widow Pension Registration (पेंशन)', category: 'Utilities', fee: 'Free', time: '30 days' }
]

export default function ApplyServicePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialServiceId = searchParams.get('service')

  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(
    POPULAR_SERVICES.find((s) => s.id === initialServiceId) || POPULAR_SERVICES[0]
  )
  const [selectedState, setSelectedState] = useState(user?.address?.state || 'Uttar Pradesh')

  const [personalDetails, setPersonalDetails] = useState({
    name: user?.name || '',
    fatherOrSpouseName: '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    gender: 'male',
    dob: '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    pincode: user?.address?.pincode || '',
    govIdMasked: user?.govIdMasked || ''
  })

  const [serviceFields, setServiceFields] = useState({
    annualIncome: '120000',
    occupation: 'Private Service / Business',
    casteCategory: 'OBC',
    vehicleCategory: 'LMV (Motor Car) & MCWG',
    deliveryMode: 'digital_download'
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast('Please log in or register to submit a service application.', { icon: '🔒' })
      navigate('/login')
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (user) {
      setPersonalDetails((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile,
        address: user.address?.street || prev.address,
        city: user.address?.city || prev.city,
        pincode: user.address?.pincode || prev.pincode,
        govIdMasked: user.govIdMasked || prev.govIdMasked
      }))
      if (user.address?.state) {
        setSelectedState(user.address.state)
      }
    }
  }, [user])

  const handleFileUpload = async (e, documentType) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds 5MB size limit. Please upload a smaller document.')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentType', documentType)

      const res = await api.applications.uploadFile(formData)
      if (res?.success && res.file) {
        setUploadedFiles((prev) => [...prev.filter((f) => f.documentType !== documentType), res.file])
        toast.success(`${file.name} uploaded successfully!`)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload document.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true)

      const payload = {
        serviceId: selectedService.id,
        serviceName: `${selectedService.name} (${selectedState})`,
        formData: {
          state: selectedState,
          ...personalDetails,
          ...serviceFields
        },
        uploadedFiles
      }

      const res = await api.applications.apply(payload)
      if (res?.success) {
        toast.success('Application submitted successfully!')
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } })
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed. Please verify form details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Helmet>
        <title>Apply for Service – OneDesk India</title>
      </Helmet>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/15 text-gold-600 dark:text-gold-400 border border-gold-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OneDesk Single-Window Application Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Direct Citizen Service Application
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Apply online with auto-filled profile credentials, automatic status tracking, and digitally signed certificate delivery.
        </p>
      </div>

      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {[
          { num: 1, label: 'Select Service' },
          { num: 2, label: 'Applicant Info' },
          { num: 3, label: 'Upload Proofs' },
          { num: 4, label: 'Review & Submit' }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= s.num
                  ? 'bg-gradient-to-r from-saffron to-gold-500 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-royal-800 text-gray-500'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-5 h-5 text-white" /> : s.num}
            </div>
            <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-royal-850 rounded-2xl shadow-luxury dark:shadow-luxury-dark border border-gray-100 dark:border-royal-700/80 p-6 sm:p-8 relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-saffron" />
                <span>Choose Document / Service</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POPULAR_SERVICES.map((serv) => (
                  <div
                    key={serv.id}
                    onClick={() => setSelectedService(serv)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedService.id === serv.id
                        ? 'border-gold-500 bg-gold-500/10 dark:bg-royal-800 shadow-sm'
                        : 'border-gray-200 dark:border-royal-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                        {serv.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {serv.fee}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1">
                      {serv.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{serv.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Select Issuing State / Territory
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-royal-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-luxury flex items-center gap-2 text-sm"
                >
                  <span>Continue to Applicant Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Applicant Personal Information
                </h2>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Profile Auto-Filled</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={personalDetails.name}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Father's / Spouse's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={personalDetails.fatherOrSpouseName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, fatherOrSpouseName: e.target.value })}
                    placeholder="e.g. Anand Kumar Sharma"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={personalDetails.email}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-royal-800 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={personalDetails.mobile}
                    className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-royal-800 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Residential Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={personalDetails.address}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                  placeholder="House No, Ward, Street, Village/Colony"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={personalDetails.city}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                    placeholder="e.g. Lucknow"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={personalDetails.pincode}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="226001"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-royal-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-luxury-outline flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-luxury flex items-center gap-2 text-sm"
                >
                  <span>Continue to Uploads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Upload Required Documents (Max 5MB each)
              </h2>

              <div className="space-y-4">
                {[
                  { id: 'id_proof', label: '1. Identity Proof (Aadhaar / Voter ID / PAN)', desc: 'Front and back scan in PDF, JPG, or PNG' },
                  { id: 'address_proof', label: '2. Address Proof (Electricity Bill / Ration Card / Domicile)', desc: 'Valid address proof document' },
                  { id: 'income_or_supporting', label: '3. Supporting Document / Self Declaration Slip', desc: 'Signed declaration or salary slip' }
                ].map((doc) => {
                  const uploaded = uploadedFiles.find((f) => f.documentType === doc.id)

                  return (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-royal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">{doc.label}</h4>
                        <p className="text-[11px] text-gray-400">{doc.desc}</p>
                        {uploaded && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Uploaded: {uploaded.originalName}</span>
                          </div>
                        )}
                      </div>

                      <label className="btn-luxury-outline cursor-pointer shrink-0 text-xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploaded ? 'Replace Document' : 'Choose File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, doc.id)}
                        />
                      </label>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-royal-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-luxury-outline flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn-luxury flex items-center gap-2 text-sm"
                >
                  <span>Review Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Review & Confirm Citizen Application
              </h2>

              <div className="p-4 bg-gray-50 dark:bg-royal-900 rounded-xl border border-gray-200 dark:border-royal-700 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">State / Territory:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedState}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applicant Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{personalDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile & Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">+91 {personalDetails.mobile} • {personalDetails.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Method:</span>
                  <span className="font-semibold text-emerald-600">Digital Certificate (PDF with Tamper-Proof QR)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Attached Proofs:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{uploadedFiles.length} file(s) attached</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                I hereby declare that all information furnished above is genuine and accurate. I understand that submitting false or misleading documents is a punishable legal offence.
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-royal-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-luxury-outline flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitApplication}
                  className="btn-luxury flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Application Now</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
