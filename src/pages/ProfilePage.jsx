import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { User, Mail, Phone, ShieldCheck, MapPin, CheckCircle2, Lock, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { api } from '../services/api'
import { STATES } from '../data/services'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuthStore()

  const [name, setName] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    if (user) {
      setName(user.name || '')
      setStreet(user.address?.street || '')
      setCity(user.address?.city || '')
      setState(user.address?.state || 'Uttar Pradesh')
      setPincode(user.address?.pincode || '')
    }
  }, [user, isAuthenticated, authLoading, navigate])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await api.auth.updateProfile({
        name,
        address: { street, city, state, pincode }
      })
      if (res?.success && res.user) {
        updateUser(res.user)
        toast.success('Citizen profile updated successfully!')
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out safely.')
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Helmet>
        <title>Citizen Profile – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-gold-500" />
            <span>Citizen Profile & Credential Desk</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Official citizen record. Used to pre-fill future applications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-luxury-outline text-xs flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Safely</span>
        </button>
      </div>

      <div className="bg-white dark:bg-royal-850 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-royal-700/80 shadow-luxury space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100 dark:border-royal-700">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron to-gold-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gold-500/20 text-gold-600 dark:text-gold-400">
                Register ID: {user?.registerId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Citizen</span>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Verified Government ID
              </label>
              <input
                type="text"
                disabled
                value={user?.govIdMasked || 'UID / PAN Attested'}
                className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-royal-800 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Registered Email (Verified)
              </label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
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
                value={user?.mobile ? `+91 ${user.mobile}` : ''}
                className="w-full px-3.5 py-2.5 bg-gray-100 dark:bg-royal-800 border border-gray-200 dark:border-royal-700 rounded-xl text-sm text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="font-bold text-xs uppercase text-gray-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span>Residential Address (Pre-fills certificates)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Street / Locality
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="House number, Street, Ward, Area"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lucknow"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    State / UT
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  >
                    {STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="226001"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-royal-900 border border-gray-200 dark:border-royal-700 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-royal-800">
            <button
              type="submit"
              disabled={saving}
              className="btn-luxury text-xs px-6 py-2.5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
