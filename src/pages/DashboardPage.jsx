import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  User,
  Users,
  QrCode,
  LifeBuoy
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, ready: 0, rejected: 0 })
  const [applications, setApplications] = useState([])
  const [documents, setDocuments] = useState([])
  const [dependents, setDependents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated, authLoading, navigate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, appsRes, docsRes, depRes] = await Promise.all([
        api.applications.getStats().catch(() => ({ stats: {} })),
        api.applications.getMy({ limit: 10 }).catch(() => ({ applications: [] })),
        api.documents.getMy().catch(() => ({ documents: [] })),
        api.dependents.getAll().catch(() => ({ dependents: [] }))
      ])

      if (statsRes.stats) setStats(statsRes.stats)
      if (appsRes.applications) setApplications(appsRes.applications)
      if (docsRes.documents) setDocuments(docsRes.documents)
      if (depRes.dependents) setDependents(depRes.dependents)
    } catch (err) {
      toast.error('Failed to load dashboard records.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">✓ Ready to Download</span>
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">✓ Approved</span>
      case 'in_review':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">⏳ In Review</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">✕ Rejected</span>
      case 'action_required':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300">⚠️ Action Needed</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">📤 Submitted</span>
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading citizen command dashboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Helmet>
        <title>Citizen Dashboard – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-gradient-to-r from-royal-850 via-royal-900 to-royal-850 text-white rounded-2xl p-6 sm:p-8 border border-gold-500/30 shadow-luxury relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30 uppercase">
                Verified Citizen Account
              </span>
              <span className="text-xs text-gray-400">ID: {user?.registerId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Namaste, <span className="bg-gradient-to-r from-gold-300 to-amber-200 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              One-stop centralized status tracking, official document locker, and application hub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/apply"
              className="btn-luxury flex items-center gap-2 text-sm shadow-glow-gold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Service</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-royal-700/80">
          <div className="bg-royal-800/60 p-4 rounded-xl border border-royal-700/50">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Total Applications</span>
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-white">{stats.total}</div>
          </div>

          <div className="bg-royal-800/60 p-4 rounded-xl border border-royal-700/50">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>In Process</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-amber-300">{stats.pending}</div>
          </div>

          <div className="bg-royal-800/60 p-4 rounded-xl border border-royal-700/50">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Ready to Download</span>
              <Download className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-emerald-400">{stats.ready}</div>
          </div>

          <div className="bg-royal-800/60 p-4 rounded-xl border border-royal-700/50">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Verified Documents</span>
              <ShieldCheck className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-gold-300">{documents.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-saffron" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Applications</h2>
            </div>
            <Link to="/apply" className="text-xs font-semibold text-saffron hover:underline">
              + New Application
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white dark:bg-royal-850 rounded-2xl p-10 text-center border border-gray-100 dark:border-royal-700">
              <div className="w-12 h-12 mx-auto rounded-full bg-gold-500/10 text-gold-600 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">No active applications yet</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                Apply for certificates, licences, and government services directly with auto-fill and instant status tracking.
              </p>
              <Link to="/apply" className="btn-luxury inline-flex items-center gap-2 text-xs mt-4">
                <PlusCircle className="w-4 h-4" />
                <span>Start First Application</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app._id}
                  onClick={() => setSelectedApp(app)}
                  className="bg-white dark:bg-royal-850 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-royal-700 hover:border-gold-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">
                        #{app.applicationNo}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      {app.serviceName}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Applied on: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.issuedDocumentId && (
                      <a
                        href={api.documents.download(app.issuedDocumentId._id || app.issuedDocumentId)}
                        onClick={(e) => e.stopPropagation()}
                        download
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>
                    )}
                    <button
                      type="button"
                      className="text-xs font-semibold text-gray-500 dark:text-gray-300 hover:text-gold-500"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Document Locker</h2>
            </div>
            <Link to="/documents" className="text-xs font-semibold text-gold-500 hover:underline">
              View All
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="bg-white dark:bg-royal-850 rounded-2xl p-8 text-center border border-gray-100 dark:border-royal-700">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">Vault Empty</h4>
              <p className="text-[11px] text-gray-400 mt-1">
                Approved government certificates and service completion documents will be stored here permanently with QR verification.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700 hover:border-gold-500/40 transition-all space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{doc.title}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">Ref: {doc.verificationId}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      ✓ Authentic
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-royal-800">
                    <Link
                      to={`/verify-document?id=${doc.verificationId}`}
                      className="text-[11px] font-semibold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Verify QR</span>
                    </Link>

                    <a
                      href={api.documents.download(doc._id)}
                      download
                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Family Profiles Card */}
          <div className="bg-white dark:bg-royal-850 p-5 rounded-2xl border border-gray-100 dark:border-royal-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Family Profiles</h3>
              </div>
              <Link to="/family-profiles" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                Manage ({dependents.length})
              </Link>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Link family members to apply for certificates, licences, and pensions on their behalf under one secure account.
            </p>
            {dependents.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dependents.slice(0, 3).map((dep) => (
                  <span
                    key={dep._id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-700/50"
                  >
                    <span className="font-medium">{dep.name}</span>
                    <span className="text-[10px] opacity-75 capitalize">({dep.relationship})</span>
                  </span>
                ))}
                {dependents.length > 3 && (
                  <span className="text-xs text-gray-400 self-center">+{dependents.length - 3} more</span>
                )}
              </div>
            ) : (
              <Link
                to="/family-profiles"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                + Add Family Member
              </Link>
            )}
          </div>

          <div className="bg-gradient-to-br from-royal-850 to-royal-900 text-white rounded-2xl p-5 border border-royal-700 space-y-3">
            <div className="flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-gold-400" />
              <h4 className="font-bold text-xs">Citizen Helpdesk & Support</h4>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Encountering an issue or have a question regarding document requirements? Open an official inquiry ticket with our facilitation desk.
            </p>
            <Link
              to="/support"
              className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-royal-700 hover:bg-royal-600 text-gold-300 transition-colors"
            >
              Open Support Ticket →
            </Link>
          </div>
        </div>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-royal-850 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-royal-700 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-royal-700 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gray-400">#{selectedApp.applicationNo}</span>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mt-0.5">{selectedApp.serviceName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-royal-800">
                <span className="text-gray-500">Current Status:</span>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>

              {selectedApp.officerNotes && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">Officer Notes:</div>
                  <div className="text-amber-800 dark:text-amber-300">{selectedApp.officerNotes}</div>
                </div>
              )}

              {selectedApp.history && selectedApp.history.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Application Timeline:</h4>
                  <div className="space-y-2 border-l-2 border-gold-500/40 pl-3">
                    {selectedApp.history.map((h, i) => (
                      <div key={i} className="text-[11px] space-y-0.5">
                        <div className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                          {h.status.replace('_', ' ')}
                        </div>
                        <div className="text-gray-400">
                          {new Date(h.timestamp).toLocaleString('en-IN')} by {h.updatedBy} ({h.role})
                        </div>
                        {h.remarks && <div className="text-gray-600 dark:text-gray-300 italic">{h.remarks}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-royal-700 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-royal-800 hover:bg-gray-200 dark:hover:bg-royal-700 text-gray-700 dark:text-gray-200"
              >
                Close Window
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
