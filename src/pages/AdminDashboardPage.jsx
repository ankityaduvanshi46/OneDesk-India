import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  ShieldAlert,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Eye,
  Search,
  Download,
  Activity,
  Award
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading } = useAuthStore()

  const [activeTab, setActiveTab] = useState('applications')
  const [stats, setStats] = useState({ totalUsers: 0, totalApplications: 0, totalDocuments: 0, breakdown: {} })
  const [applications, setApplications] = useState([])
  const [usersList, setUsersList] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [newStatus, setNewStatus] = useState('in_review')
  const [officerRemarks, setOfficerRemarks] = useState('')
  const [issuingDoc, setIssuingDoc] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      if (user?.role !== 'staff' && user?.role !== 'super_admin') {
        toast.error('Access restricted to authorized administrative personnel.')
        navigate('/dashboard')
        return
      }
      loadAdminData()
    }
  }, [isAuthenticated, authLoading, user, navigate, activeTab])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const overviewRes = await api.admin.getOverview().catch(() => ({ stats: {} }))
      if (overviewRes.stats) setStats(overviewRes.stats)

      if (activeTab === 'applications') {
        const appsRes = await api.admin.getApplications({ status: statusFilter, search: searchQuery })
        if (appsRes?.applications) setApplications(appsRes.applications)
      } else if (activeTab === 'users') {
        const usersRes = await api.admin.getUsers({ search: searchQuery })
        if (usersRes?.users) setUsersList(usersRes.users)
      } else if (activeTab === 'audit') {
        const auditRes = await api.admin.getAuditLogs()
        if (auditRes?.logs) setAuditLogs(auditRes.logs)
      }
    } catch {
      toast.error('Failed to load administrative records.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedApp) return
    try {
      setUpdatingStatus(true)
      const res = await api.admin.updateStatus(selectedApp._id, {
        status: newStatus,
        remarks: officerRemarks
      })
      if (res?.success) {
        toast.success(`Application updated to ${newStatus}!`)
        setSelectedApp(null)
        loadAdminData()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleIssueDocument = async () => {
    if (!selectedApp) return
    try {
      setIssuingDoc(true)
      const res = await api.admin.issueDocument(selectedApp._id, {
        title: `Official Certificate of ${selectedApp.serviceName}`,
        officerRemarks: officerRemarks || 'Approved and digitally authenticated by OneDesk Directorate.'
      })
      if (res?.success) {
        toast.success('Certificate generated, signed, and emailed to citizen!')
        setSelectedApp(null)
        loadAdminData()
      }
    } catch (err) {
      toast.error(err.message || 'Failed to issue digital document.')
    } finally {
      setIssuingDoc(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400">Loading administrative control desk...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Helmet>
        <title>Administrative Command Desk – OneDesk India</title>
      </Helmet>

      <div className="bg-royal-900 text-white rounded-2xl p-6 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/40">
              {user?.role === 'super_admin' ? 'Super Administrator' : 'Verification Staff'}
            </span>
            <span className="text-xs text-gray-400">Logged as {user?.name}</span>
          </div>
          <h1 className="text-2xl font-bold">Administrative Operations & Verification Center</h1>
        </div>

        <div className="flex gap-2">
          {['applications', 'users', 'audit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-saffron to-gold-500 text-white shadow-md'
                  : 'bg-royal-800 text-gray-300 hover:bg-royal-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700">
          <span className="text-xs text-gray-400">Registered Citizens</span>
          <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stats.totalUsers}</div>
        </div>
        <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700">
          <span className="text-xs text-gray-400">Total Applications</span>
          <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{stats.totalApplications}</div>
        </div>
        <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700">
          <span className="text-xs text-gray-400">Under Review</span>
          <div className="text-2xl font-bold mt-1 text-amber-500">{stats.breakdown?.in_review || 0}</div>
        </div>
        <div className="bg-white dark:bg-royal-850 p-4 rounded-xl border border-gray-100 dark:border-royal-700">
          <span className="text-xs text-gray-400">Certificates Issued</span>
          <div className="text-2xl font-bold mt-1 text-emerald-500">{stats.totalDocuments}</div>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['all', 'submitted', 'in_review', 'approved', 'ready', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st)
                    loadAdminData()
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-gold-500 text-royal-900 font-bold'
                      : 'bg-gray-100 dark:bg-royal-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadAdminData()}
                placeholder="Search by app # or service..."
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-royal-850 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-royal-850 rounded-2xl border border-gray-100 dark:border-royal-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-royal-900/60 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100 dark:border-royal-700">
                  <tr>
                    <th className="p-3.5">App Number</th>
                    <th className="p-3.5">Citizen Name</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-royal-800">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-royal-800/40">
                      <td className="p-3.5 font-mono font-bold text-gray-900 dark:text-white">
                        {app.applicationNo}
                      </td>
                      <td className="p-3.5 font-medium text-gray-800 dark:text-gray-200">
                        {app.userId?.name || 'Citizen'}
                        <div className="text-[10px] text-gray-400">{app.userId?.mobile}</div>
                      </td>
                      <td className="p-3.5 text-gray-700 dark:text-gray-300">{app.serviceName}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-royal-800 text-gray-700 dark:text-gray-300">
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app)
                            setNewStatus(app.status)
                            setOfficerRemarks(app.officerNotes || '')
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-royal-800 hover:bg-royal-700 text-gold-400"
                        >
                          Review & Action →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-royal-850 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-royal-700 max-h-[90vh] overflow-y-auto space-y-6"
          >
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-royal-700 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-gold-500">#{selectedApp.applicationNo}</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{selectedApp.serviceName}</h2>
                <p className="text-xs text-gray-400">
                  Applicant: {selectedApp.userId?.name} (Register ID: {selectedApp.userId?.registerId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-royal-900 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Citizen Form Data</h4>
              <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
                {Object.entries(selectedApp.formData || {}).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-gray-400 capitalize">{key}:</span> {String(val)}
                  </div>
                ))}
              </div>
            </div>

            {selectedApp.uploadedFiles && selectedApp.uploadedFiles.length > 0 && (
              <div>
                <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">Attached ID Proofs & Files</h4>
                <div className="space-y-2">
                  {selectedApp.uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-royal-900 rounded-lg text-xs">
                      <span>{file.originalName} ({file.documentType})</span>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-500 hover:underline font-semibold"
                      >
                        Inspect File ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-royal-800">
              <h4 className="font-bold text-xs uppercase text-gray-500">Take Administrative Action</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
                  >
                    <option value="in_review">In Review</option>
                    <option value="action_required">Action Required (Need correction)</option>
                    <option value="approved">Approved</option>
                    <option value="ready">Ready (Document Issued)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">Officer Remarks (Sent to user)</label>
                  <input
                    type="text"
                    value={officerRemarks}
                    onChange={(e) => setOfficerRemarks(e.target.value)}
                    placeholder="e.g. Identity verified via State Ledger"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  disabled={updatingStatus}
                  onClick={handleUpdateStatus}
                  className="btn-luxury-outline w-full sm:w-auto text-xs py-2 px-4"
                >
                  {updatingStatus ? 'Updating...' : 'Save Status Update'}
                </button>

                <button
                  type="button"
                  disabled={issuingDoc}
                  onClick={handleIssueDocument}
                  className="btn-luxury w-full sm:w-auto text-xs py-2 px-4 flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>{issuingDoc ? 'Generating PDF...' : 'One-Click Issue Official Certificate (PDF)'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
