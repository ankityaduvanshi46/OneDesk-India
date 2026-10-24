import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, QrCode, FileText, Download, Building } from 'lucide-react'
import { api } from '../services/api'
import Logo from '../components/Logo'

export default function VerifyDocumentPage() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('id') || searchParams.get('ref') || ''

  const [verificationId, setVerificationId] = useState(initialId)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialId.trim()) {
      handleVerify(initialId.trim())
    }
  }, [initialId])

  const handleVerify = async (idToVerify) => {
    const id = (idToVerify || verificationId).trim().toUpperCase()
    if (!id) return

    try {
      setLoading(true)
      setError('')
      setResult(null)

      const res = await api.documents.verify(id)
      if (res?.success && res.document) {
        setResult(res.document)
      } else {
        setError(res?.message || 'Verification record not found.')
      }
    } catch (err) {
      setError(err.message || 'No official document found matching this Verification Reference.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleVerify()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Helmet>
        <title>Public Document Verification – OneDesk India</title>
      </Helmet>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4" />
          <span>National Digital Certificate Authenticity Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify Document Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Enter the unique Verification Reference printed on any OneDesk India document or scanned from its tamper-proof QR code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <QrCode className="w-5 h-5" />
          </span>
          <input
            type="text"
            required
            value={verificationId}
            onChange={(e) => setVerificationId(e.target.value.toUpperCase())}
            placeholder="e.g. VER-4A9B-12C3-89DF"
            className="w-full pl-12 pr-32 py-3.5 bg-white dark:bg-royal-850 border border-gray-200 dark:border-royal-700 rounded-2xl text-sm font-mono tracking-wider font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 btn-luxury py-2 px-4 text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>
      </form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3.5 max-w-xl mx-auto"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-900 dark:text-red-200">Invalid or Unverified Reference</h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-royal-850 rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-luxury relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-gold-400 to-emerald-600" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-royal-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  ✓ Officially Authenticated
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {result.title}
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-semibold text-gray-400 uppercase">Verification ID</span>
              <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{result.verificationId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-gray-100 dark:border-royal-700 text-xs">
            <div>
              <span className="text-gray-400">Authorized Citizen Name:</span>
              <p className="font-bold text-sm text-gray-900 dark:text-white mt-0.5">{result.applicantName}</p>
            </div>
            <div>
              <span className="text-gray-400">Citizen Register ID:</span>
              <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">{result.registerId}</p>
            </div>
            <div>
              <span className="text-gray-400">Application Number:</span>
              <p className="font-mono font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{result.applicationNo}</p>
            </div>
            <div>
              <span className="text-gray-400">Identity Attestation:</span>
              <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{result.govIdMasked}</p>
            </div>
            <div>
              <span className="text-gray-400">Issuing Authority:</span>
              <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">OneDesk Facilitation & Digital Verification Authority</p>
            </div>
            <div>
              <span className="text-gray-400">Date of Attestation:</span>
              <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                {new Date(result.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building className="w-4 h-4 text-gold-500" />
              <span>Digital Record Authenticated via MongoDB Atlas Cryptographic Ledger</span>
            </div>

            <Link
              to="/services"
              className="btn-luxury-outline text-xs px-4 py-2"
            >
              Browse All Services
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
