import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import SearchBar from '../components/SearchBar'

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <Helmet>
        <title>404 Page Not Found – OneDesk India</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="text-7xl font-black text-brand-primary" aria-hidden="true">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {t('errors.notFound')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('errors.notFoundHint')}
        </p>
      </div>

      <div className="max-w-md mx-auto pt-2">
        <SearchBar autoFocus />
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-primary text-sm px-6 py-2.5">
          {t('errors.goHome')}
        </Link>
        <Link to="/services" className="btn-secondary text-sm px-6 py-2.5">
          {t('nav.services')}
        </Link>
      </div>

      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Popular Services
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Aadhaar', to: '/services/aadhaar' },
            { label: 'PAN Card', to: '/services/pan-card' },
            { label: 'Driving Licence', to: '/services/driving-licence' },
            { label: 'Passport Seva', to: '/services/passport' },
            { label: 'Voter ID', to: '/services/voter-id' },
            { label: 'Citizen Guides', to: '/blog' }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-brand-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
