import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { ShieldCheck, Download, QrCode, Search, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'

export default function MyDocumentsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (isAuthenticated) {
      loadDocuments()
    }
  }, [isAuthenticated, authLoading, navigate])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const res = await api.documents.getMy()
      if (res?.success && res.documents) {
        setDocuments(res.documents)
      }
    } catch {
      toast.error('Failed to load your documents vault.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.verificationId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Helmet>
        <title>My Document Locker – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-gold-500" />
            <span>Digital Document Locker</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Official government certificates and attestations with cryptographic verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/apply" className="btn-luxury text-xs flex items-center gap-1.5">
            <span>Apply for New Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by certificate title or verification ID..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-royal-850 border border-gray-200 dark:border-royal-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
        />
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading your secure documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-royal-850 rounded-2xl p-12 text-center border border-gray-100 dark:border-royal-700 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">No documents available</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Once an application is approved and marked ready by verification officers, your official digital certificate will appear here.
          </p>
          <Link to="/apply" className="btn-luxury inline-block text-xs mt-2">
            Submit an Application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white dark:bg-royal-850 rounded-2xl border border-gray-100 dark:border-royal-700 p-5 shadow-luxury dark:shadow-luxury-dark space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-emerald-500" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ✓ Verified Document
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1.5">{doc.title}</h3>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-royal-900 rounded-lg">
                  <FileText className="w-5 h-5 text-gold-500" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Verification ID:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{doc.verificationId}</span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Issued Date:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {new Date(doc.issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Authenticity:</span>
                  <span className="text-emerald-600 font-semibold">Digitally Signed (Lifetime)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-royal-800 flex items-center gap-2">
                <a
                  href={api.documents.download(doc._id)}
                  download
                  className="flex-1 btn-luxury py-2 text-xs flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>

                <Link
                  to={`/verify-document?id=${doc.verificationId}`}
                  className="px-3 py-2 btn-luxury-outline text-xs flex items-center gap-1"
                  title="Verify Document Integrity Online"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
