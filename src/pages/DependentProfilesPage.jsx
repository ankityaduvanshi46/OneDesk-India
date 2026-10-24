import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  User,
  Calendar,
  Shield,
  FileText,
  X,
  Save,
  AlertTriangle
} from 'lucide-react'
import { api } from '../services/api'
import { useAuthStore } from '../store/useAuthStore'

// ── constants ─────────────────────────────────────────────────────────────────
const RELATIONSHIPS = [
  { value: 'spouse',  label: 'Spouse',  labelHi: 'पति/पत्नी' },
  { value: 'child',   label: 'Child',   labelHi: 'बच्चा' },
  { value: 'parent',  label: 'Parent',  labelHi: 'माता-पिता' },
  { value: 'sibling', label: 'Sibling', labelHi: 'भाई-बहन' },
  { value: 'other',   label: 'Other',   labelHi: 'अन्य' }
]

const GENDERS = [
  { value: 'male',   label: 'Male',   labelHi: 'पुरुष' },
  { value: 'female', label: 'Female', labelHi: 'महिला' },
  { value: 'other',  label: 'Other',  labelHi: 'अन्य' }
]

const GOV_ID_TYPES = [
  { value: 'none',         label: 'None / Not provided' },
  { value: 'aadhaar_last4',label: 'Aadhaar (last 4 digits only)' },
  { value: 'pan',          label: 'PAN Card' },
  { value: 'birth_cert',   label: 'Birth Certificate No.' },
  { value: 'voter_id',     label: 'Voter ID' }
]

const RELATION_COLORS = {
  spouse:  'bg-pink-100  text-pink-800  dark:bg-pink-900/30  dark:text-pink-300',
  child:   'bg-blue-100  text-blue-800  dark:bg-blue-900/30  dark:text-blue-300',
  parent:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  sibling: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  other:   'bg-gray-100  text-gray-800  dark:bg-gray-700     dark:text-gray-300'
}

const EMPTY_FORM = {
  name: '',
  relationship: 'child',
  gender: 'other',
  dateOfBirth: '',
  govIdType: 'none',
  govIdNumber: '',
  notes: ''
}

// ── helpers ───────────────────────────────────────────────────────────────────
function calcAge(dob) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

function relLabel(value, lang) {
  const r = RELATIONSHIPS.find(r => r.value === value)
  return r ? (lang === 'hi' ? r.labelHi : r.label) : value
}

// ── small components ──────────────────────────────────────────────────────────
function EmptyState({ lang }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Simple family SVG illustration */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6 opacity-80">
        {/* adult 1 */}
        <circle cx="38" cy="36" r="14" fill="#D4AF37" fillOpacity="0.25" stroke="#D4AF37" strokeWidth="2"/>
        <rect x="24" y="54" width="28" height="36" rx="8" fill="#0A192F" fillOpacity="0.15" stroke="#0A192F" strokeOpacity="0.3" strokeWidth="2"/>
        {/* adult 2 */}
        <circle cx="82" cy="36" r="14" fill="#D4AF37" fillOpacity="0.25" stroke="#D4AF37" strokeWidth="2"/>
        <rect x="68" y="54" width="28" height="36" rx="8" fill="#0A192F" fillOpacity="0.15" stroke="#0A192F" strokeOpacity="0.3" strokeWidth="2"/>
        {/* child */}
        <circle cx="60" cy="78" r="10" fill="#FF6B35" fillOpacity="0.25" stroke="#FF6B35" strokeWidth="2"/>
        <rect x="50" y="92" width="20" height="24" rx="6" fill="#FF6B35" fillOpacity="0.15" stroke="#FF6B35" strokeOpacity="0.3" strokeWidth="2"/>
        {/* connector lines */}
        <line x1="52" y1="60" x2="60" y2="68" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2"/>
        <line x1="68" y1="60" x2="60" y2="68" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {lang === 'hi' ? 'कोई पारिवारिक प्रोफ़ाइल नहीं' : 'No Family Profiles Yet'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs">
        {lang === 'hi'
          ? 'परिवार के सदस्यों को जोड़ें और उनके लिए सरकारी सेवाओं के लिए आवेदन करें।'
          : 'Add family members to apply for government services on their behalf from one account.'}
      </p>
    </motion.div>
  )
}

function DependentCard({ dep, lang, onEdit, onDelete, onView }) {
  const age = calcAge(dep.dateOfBirth)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {dep.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 dark:text-white truncate">{dep.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RELATION_COLORS[dep.relationship]}`}>
              {relLabel(dep.relationship, lang)}
            </span>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(dep)}
            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
            title="Edit"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(dep)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
        {age !== null && (
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-amber-500" />
            <span>{lang === 'hi' ? `${age} वर्ष` : `${age} yrs`}</span>
          </div>
        )}
        {dep.govIdType && dep.govIdType !== 'none' && (
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-amber-500" />
            <span className="truncate">{dep.govIdMasked || '••••'}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <FileText size={13} className="text-amber-500" />
          <span>{dep.applicationCount ?? 0} {lang === 'hi' ? 'आवेदन' : 'Applications'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={13} className="text-amber-500" />
          <span>{dep.documentCount ?? 0} {lang === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
        </div>
      </div>

      {/* View button */}
      <button
        onClick={() => onView(dep)}
        className="flex items-center justify-center gap-1.5 w-full text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl py-2 transition"
      >
        {lang === 'hi' ? 'विस्तार देखें' : 'View Details'} <ChevronRight size={14} />
      </button>
    </motion.div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function DependentProfilesPage() {
  const { user } = useAuthStore()
  const lang = typeof window !== 'undefined' && document.documentElement.lang === 'hi' ? 'hi' : 'en'

  const [dependents, setDependents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // null = create mode
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedDep, setSelectedDep] = useState(null) // detail view
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ── load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadDependents()
  }, [])

  async function loadDependents() {
    setLoading(true)
    try {
      const data = await api.dependents.getAll()
      setDependents(data.dependents || [])
    } catch (err) {
      toast.error(err.message || 'Failed to load family profiles')
    } finally {
      setLoading(false)
    }
  }

  // ── modal helpers ────────────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(dep) {
    setEditTarget(dep)
    setForm({
      name: dep.name,
      relationship: dep.relationship,
      gender: dep.gender || 'other',
      dateOfBirth: dep.dateOfBirth ? dep.dateOfBirth.slice(0, 10) : '',
      govIdType: dep.govIdType || 'none',
      govIdNumber: '',   // never pre-fill ID numbers
      notes: dep.notes || ''
    })
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditTarget(null)
    setForm(EMPTY_FORM)
  }

  // ── save ─────────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        relationship: form.relationship,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        govIdType: form.govIdType,
        govIdNumber: form.govIdNumber || undefined,
        notes: form.notes || undefined
      }

      if (editTarget) {
        await api.dependents.update(editTarget._id, payload)
        toast.success(lang === 'hi' ? 'प्रोफ़ाइल अपडेट हुई' : 'Profile updated')
      } else {
        await api.dependents.create(payload)
        toast.success(lang === 'hi' ? 'परिवार सदस्य जोड़ा गया' : 'Family member added')
      }

      closeModal()
      loadDependents()
    } catch (err) {
      toast.error(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  // ── delete ───────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.dependents.delete(deleteTarget._id)
      toast.success(lang === 'hi' ? 'प्रोफ़ाइल हटाई गई' : 'Profile removed')
      setDeleteTarget(null)
      if (selectedDep?._id === deleteTarget._id) setSelectedDep(null)
      loadDependents()
    } catch (err) {
      toast.error(err.message || 'Failed to remove profile')
    } finally {
      setDeleting(false)
    }
  }

  // ── detail view ───────────────────────────────────────────────────────────────
  async function handleView(dep) {
    try {
      const data = await api.dependents.getById(dep._id)
      setSelectedDep(data.dependent)
    } catch {
      setSelectedDep(dep)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'परिवार प्रोफ़ाइल | OneDesk India' : 'Family Profiles | OneDesk India'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="text-amber-500" size={26} />
                {lang === 'hi' ? 'परिवार प्रोफ़ाइल' : 'Family Profiles'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                {lang === 'hi'
                  ? 'अपने परिवार के सदस्यों की प्रोफ़ाइल प्रबंधित करें और उनके लिए आवेदन करें।'
                  : 'Manage family member profiles and apply for services on their behalf.'}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreate}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow transition"
            >
              <Plus size={16} />
              {lang === 'hi' ? 'सदस्य जोड़ें' : 'Add Member'}
            </motion.button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 animate-pulse h-52 border border-slate-200 dark:border-slate-700" />
              ))}
            </div>
          ) : dependents.length === 0 ? (
            <EmptyState lang={lang} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {dependents.map(dep => (
                  <DependentCard
                    key={dep._id}
                    dep={dep}
                    lang={lang}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onView={handleView}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Detail side panel */}
          <AnimatePresence>
            {selectedDep && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-800 shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedDep.name}</h2>
                    <button onClick={() => setSelectedDep(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Info grid */}
                  <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4 space-y-3 mb-6">
                    <InfoRow label={lang === 'hi' ? 'संबंध' : 'Relationship'} value={relLabel(selectedDep.relationship, lang)} />
                    <InfoRow label={lang === 'hi' ? 'लिंग' : 'Gender'} value={selectedDep.gender || '—'} />
                    {selectedDep.dateOfBirth && (
                      <InfoRow
                        label={lang === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                        value={`${new Date(selectedDep.dateOfBirth).toLocaleDateString('en-IN')} (${calcAge(selectedDep.dateOfBirth)} yrs)`}
                      />
                    )}
                    {selectedDep.govIdType && selectedDep.govIdType !== 'none' && (
                      <InfoRow label={lang === 'hi' ? 'ID' : 'Gov ID'} value={selectedDep.govIdMasked || '••••'} />
                    )}
                    {selectedDep.notes && (
                      <InfoRow label={lang === 'hi' ? 'नोट्स' : 'Notes'} value={selectedDep.notes} />
                    )}
                  </div>

                  {/* Applications */}
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <FileText size={15} className="text-amber-500" />
                    {lang === 'hi' ? 'आवेदन' : 'Applications'} ({(selectedDep.applications || []).length})
                  </h3>
                  {(selectedDep.applications || []).length === 0 ? (
                    <p className="text-sm text-slate-400 mb-6">{lang === 'hi' ? 'कोई आवेदन नहीं।' : 'No applications yet.'}</p>
                  ) : (
                    <div className="space-y-2 mb-6">
                      {(selectedDep.applications || []).map(app => (
                        <div key={app._id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2 text-sm">
                          <span className="truncate text-slate-700 dark:text-slate-200">{app.serviceName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex-shrink-0 ml-2">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { openEdit(selectedDep); setSelectedDep(null) }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-medium transition"
                    >
                      <Edit2 size={14} /> {lang === 'hi' ? 'संपादित करें' : 'Edit'}
                    </button>
                    <button
                      onClick={() => { setDeleteTarget(selectedDep); setSelectedDep(null) }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl py-2.5 text-sm font-medium transition"
                    >
                      <Trash2 size={14} /> {lang === 'hi' ? 'हटाएं' : 'Remove'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={18} className="text-amber-500" />
                  {editTarget
                    ? (lang === 'hi' ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile')
                    : (lang === 'hi' ? 'परिवार सदस्य जोड़ें' : 'Add Family Member')}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder={lang === 'hi' ? 'परिवार सदस्य का नाम' : 'Family member\'s full name'}
                  />
                </div>

                {/* Relationship + Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'संबंध *' : 'Relationship *'}
                    </label>
                    <select
                      value={form.relationship}
                      onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {RELATIONSHIPS.map(r => (
                        <option key={r.value} value={r.value}>{lang === 'hi' ? r.labelHi : r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'लिंग' : 'Gender'}
                    </label>
                    <select
                      value={form.gender}
                      onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {GENDERS.map(g => (
                        <option key={g.value} value={g.value}>{lang === 'hi' ? g.labelHi : g.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date of birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Gov ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'पहचान पत्र प्रकार' : 'Government ID Type'}
                  </label>
                  <select
                    value={form.govIdType}
                    onChange={e => setForm(f => ({ ...f, govIdType: e.target.value, govIdNumber: '' }))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {GOV_ID_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {form.govIdType !== 'none' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {form.govIdType === 'aadhaar_last4'
                        ? (lang === 'hi' ? 'आधार के अंतिम 4 अंक' : 'Aadhaar — last 4 digits only')
                        : (lang === 'hi' ? 'आईडी नंबर' : 'ID Number')}
                    </label>
                    <input
                      type={form.govIdType === 'aadhaar_last4' ? 'number' : 'text'}
                      value={form.govIdNumber}
                      onChange={e => setForm(f => ({ ...f, govIdNumber: e.target.value }))}
                      maxLength={form.govIdType === 'aadhaar_last4' ? 4 : 20}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder={
                        form.govIdType === 'aadhaar_last4' ? '1234'
                        : form.govIdType === 'pan' ? 'ABCDE1234F'
                        : lang === 'hi' ? 'आईडी नंबर दर्ज करें' : 'Enter ID number'
                      }
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1">
                      <Shield size={11} className="mt-0.5 flex-shrink-0 text-amber-500" />
                      {lang === 'hi'
                        ? 'यह संख्या एन्क्रिप्टेड रूप में संग्रहीत होती है। हम पूरी आधार संख्या कभी संग्रहीत नहीं करते।'
                        : 'Stored encrypted & hashed. Full Aadhaar numbers are never stored.'}
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'नोट्स (वैकल्पिक)' : 'Notes (optional)'}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    maxLength={500}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder={lang === 'hi' ? 'कोई अतिरिक्त जानकारी...' : 'Any additional information...'}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-medium transition"
                  >
                    {saving ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : <Save size={14} />}
                    {editTarget
                      ? (lang === 'hi' ? 'अपडेट करें' : 'Update')
                      : (lang === 'hi' ? 'सहेजें' : 'Save')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'hi' ? 'प्रोफ़ाइल हटाएं?' : 'Remove Profile?'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                {lang === 'hi'
                  ? `"${deleteTarget.name}" की प्रोफ़ाइल आर्काइव हो जाएगी। पुराने आवेदन सुरक्षित रहेंगे।`
                  : `"${deleteTarget.name}"'s profile will be archived. Past applications remain safe.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium transition"
                >
                  {deleting && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {lang === 'hi' ? 'हटाएं' : 'Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── tiny helper component ──────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">{label}</span>
      <span className="text-slate-800 dark:text-slate-200 text-right break-all">{value}</span>
    </div>
  )
}
