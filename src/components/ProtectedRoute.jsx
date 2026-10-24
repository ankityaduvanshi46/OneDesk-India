import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { sanitizeReturnUrl } from '../utils/helpers'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const location = useLocation()
  const { user, isAuthenticated, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-28 bg-gray-200 dark:bg-royal-800 rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 dark:bg-royal-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-royal-800 rounded-xl" />
          <div className="h-24 bg-gray-200 dark:bg-royal-800 rounded-xl" />
        </div>
        <div className="h-72 bg-gray-200 dark:bg-royal-800 rounded-2xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    const rawTarget = location.pathname + location.search
    const safeTarget = sanitizeReturnUrl(rawTarget, '/dashboard')
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(safeTarget)}`} replace />
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Restricted Authorization Area
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your current account role (<code>{user?.role || 'citizen'}</code>) does not possess clearance for administrative governance desks.
        </p>
        <Link to="/dashboard" className="btn-luxury inline-flex items-center gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Citizen Dashboard</span>
        </Link>
      </div>
    )
  }

  return children
}
