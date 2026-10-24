import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  ShieldCheck,
  Download,
  QrCode,
  Search,
  FileText,
  ArrowRight,
  CheckCircle2,
  Upload,
  PlusCircle,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  X,
  File,
  Sparkles,
  Lock,
  Tag
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'
import ServiceIllustration from '../components/design-system/ServiceIllustrations'
import { SkeletonCard } from '../components/design-system/SkeletonLoader'

const CATEGORIES = [
  { id: 'all', label: 'All Documents' },
  { id: 'identity', label: 'Identity & Cards' },
  { id: 'certificates', label: 'Certificates & Revenue' },
  { id: 'transport', label: 'Transport & Driving' },
  { id: 'tax_finance', label: 'Tax & Finance' },
  { id: 'education', label: 'Educational Records' },
  { id: 'other', label: 'Other Assets' }
]

export default function MyDocumentsPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [viewingDoc, setViewingDoc] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState('identity')
  const [uploadDocType, setUploadDocType] = useState('aadhaar')
  const [uploadNotes, setUploadNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

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
      toast.error('Failed to load your digital document locker.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyVerificationId = (vId) => {
    navigator.clipboard.writeText(vId)
    setCopiedId(vId)
    toast.success('Verification ID copied to clipboard!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error('Please select a file to upload.')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10 MB limit.')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', uploadTitle)
      formData.append('category', uploadCategory)
      formData.append('docType', uploadDocType)
      formData.append('notes', uploadNotes)

      const res = await api.documents.upload(formData)
      if (res?.success) {
        toast.success('Document encrypted and stored in your Digital Locker!')
        setShowUploadModal(false)
        setUploadTitle('')
        setUploadNotes('')
        setSelectedFile(null)
        loadDocuments()
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from your locker?`)) {
      return
    }

    try {
      const res = await api.documents.delete(docId)
      if (res?.success) {
        toast.success('Document safely removed.')
        setDocuments((prev) => prev.filter((d) => d._id !== docId))
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete document.')
    }
  }

  const handleDownload = async (doc) => {
    try {
      if (doc.signedDownloadUrl) {
        window.open(doc.signedDownloadUrl, '_blank', 'noopener,noreferrer')
        return
      }
      const res = await api.documents.getDownloadUrl(doc._id)
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, '_blank', 'noopener,noreferrer')
      } else {
        window.open(api.documents.download(doc._id), '_blank', 'noopener,noreferrer')
      }
    } catch {
      toast.error('Could not generate download link.')
    }
  }

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.verificationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.documentNo && d.documentNo.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'all' || d.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Helmet>
        <title>Citizen Digital Document Locker – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-royal-950 via-royal-900 to-royal-850 rounded-3xl p-6 sm:p-8 text-white border border-gold-500/30 shadow-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30">
              Cryptographic Citizen Vault
            </span>
            <span className="text-xs text-gray-400">Owner: {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Document Locker
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Private 256-bit encrypted storage for official government certificates, attestations, and personal citizen documents.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-luxury text-xs px-4 py-2.5 flex items-center gap-2 font-bold shadow-md"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          <Link
            to="/apply"
            className="btn-luxury-outline text-xs px-4 py-2.5 flex items-center gap-2 font-semibold"
          >
            <PlusCircle className="w-4 h-4 text-saffron" />
            <span>Apply for New Service</span>
          </Link>
        </div>
      </div>

      {/* Search Bar & Category Filter Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title or verification ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-royal-850 border border-gray-200 dark:border-royal-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold-500 text-royal-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-royal-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-royal-700 hover:border-gold-500/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white dark:bg-royal-850 rounded-3xl p-12 text-center border border-gray-100 dark:border-royal-750 space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">No documents found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search query or category filter.'
                : 'Upload your Aadhaar, PAN, educational certificates, or apply for verified government certificates to build your permanent locker.'}
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-luxury inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Your First Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="luxury-glass rounded-3xl p-5 border border-gray-100 dark:border-royal-750 hover:border-gold-500/40 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-royal-800 border border-gold-500/20 shrink-0">
                    <ServiceIllustration category={doc.category || 'Identity'} className="w-10 h-10" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {doc.isSelfUploaded ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50">
                        Citizen Vault Asset
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Attested Official</span>
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-saffron transition-colors">
                    {doc.title}
                  </h3>
                  {doc.applicationId && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      App: {doc.applicationId.serviceName || doc.applicationId.applicationNo}
                    </p>
                  )}
                  {doc.notes && (
                    <p className="text-[11px] text-gray-400 italic mt-1 line-clamp-1">
                      "{doc.notes}"
                    </p>
                  )}
                </div>

                {/* Verification ID Pill with click-to-copy */}
                <div className="bg-gray-50 dark:bg-royal-900/60 p-2.5 rounded-xl border border-gray-100 dark:border-royal-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      Verification Reference ID
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-900 dark:text-gold-300 truncate block">
                      {doc.verificationId}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyVerificationId(doc.verificationId)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 transition-colors shrink-0"
                    title="Copy Verification ID"
                  >
                    {copiedId === doc.verificationId ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-royal-750 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-royal-800 transition-colors flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-gold-500" />
                  <span>Verify / QR</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn-luxury px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDocument(doc._id, doc.title)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-royal-850 rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-royal-750">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gold-500/15 text-gold-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">
                      Upload Document to Vault
                    </h3>
                    <p className="text-[11px] text-gray-400">256-bit AES encrypted private storage</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Aadhaar Card (Front & Back)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Sector Category *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs font-medium focus:outline-none"
                    >
                      <option value="identity">Identity & Cards</option>
                      <option value="certificates">Certificates & Revenue</option>
                      <option value="transport">Transport & Driving</option>
                      <option value="tax_finance">Tax & Finance</option>
                      <option value="education">Educational Records</option>
                      <option value="other">Other Asset</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Document Type
                    </label>
                    <select
                      value={uploadDocType}
                      onChange={(e) => setUploadDocType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs font-medium focus:outline-none"
                    >
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="driving_licence">Driving Licence</option>
                      <option value="voter_id">Voter ID</option>
                      <option value="marksheet">Academic Marksheet</option>
                      <option value="passport">Passport</option>
                      <option value="custom">Other Record</option>
                    </select>
                  </div>
                </div>

                {/* Drag and Drop File Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Select File (PDF, JPG, PNG, WebP — max 10MB) *
                  </label>
                  <label className="border-2 border-dashed border-gray-200 dark:border-royal-700 hover:border-gold-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50/50 dark:bg-royal-900/50">
                    <input
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <File className="w-8 h-8 text-gold-500 mb-2" />
                    {selectedFile ? (
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 block truncate max-w-xs">
                          {selectedFile.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to Encrypt
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-bold text-xs text-gray-700 dark:text-gray-200 block">
                          Click to browse or drop file here
                        </span>
                        <span className="text-[10px] text-gray-400">PDF, JPG, PNG up to 10MB</span>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Notes / Tagging (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    placeholder="e.g. Scanned at regional cyber cafe, verified original"
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-royal-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn-luxury px-5 py-2 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Encrypt & Save to Locker</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR VERIFICATION / ATTESTATION MODAL */}
      <AnimatePresence>
        {viewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDoc(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-royal-850 rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-2xl z-10 space-y-5 text-center"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-royal-750">
                <span className="font-bold text-xs uppercase tracking-wider text-gold-500">
                  Cryptographic Attestation Record
                </span>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Graphic */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 inline-block mx-auto shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    viewingDoc.qrCodeData || `${window.location.origin}/verify-document?ref=${viewingDoc.verificationId}`
                  )}`}
                  alt="QR Attestation Code"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">{viewingDoc.title}</h4>
                <p className="font-mono text-xs text-gold-600 dark:text-gold-400 font-bold">
                  {viewingDoc.verificationId}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-royal-900 rounded-xl text-left text-xs space-y-1.5 border border-gray-100 dark:border-royal-800">
                <div className="flex justify-between">
                  <span className="text-gray-400">Citizen:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Document No:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{viewingDoc.documentNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Attestation Seal:</span>
                  <span className="text-emerald-500 font-bold">SHA-256 Valid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage Vault:</span>
                  <span className="text-blue-500 font-bold">Private Signed URL</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => handleDownload(viewingDoc)}
                  className="btn-luxury w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Verified PDF / Asset</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
