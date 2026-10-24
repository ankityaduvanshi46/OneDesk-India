import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="hidden md:block bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-3">
            <Logo size="lg" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              {t('tagline')}. {t('footer.disclaimer')}
            </p>
            <div className="px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-xl">
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                ⚠️ {t('disclaimer')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['/', t('nav.home')],
                ['/services', t('nav.services')],
                ['/wizard', t('nav.wizard')],
                ['/favourites', t('nav.favourites')],
                ['/quick-links', t('nav.quickLinks')],
                ['/scam-check', t('nav.scamCheck')]
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Safety & Trust</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/verify-document" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                  🔍 Verify Document (QR)
                </Link>
              </li>
              <li>
                <Link to="/scam-check" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                  🛡️ {t('nav.scamCheck')}
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                  🔄 Refund & Fee Policy
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                  🎧 Citizen Helpdesk
                </Link>
              </li>
              <li>
                <a
                  href="mailto:report@sarkarisevahub.in?subject=Report broken or fake link on OneDesk India"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors"
                >
                  🔗 {t('footer.reportLink')}
                </a>
              </li>
            </ul>
            <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
              {t('footer.madeWith')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
