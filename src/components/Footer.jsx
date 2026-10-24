import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, AlertTriangle, ExternalLink, Globe, Heart, Lock } from 'lucide-react'
import Logo from './Logo'
import { useAppStore } from '../store/useAppStore'

export default function Footer() {
  const { t } = useTranslation()
  const { language, toggleLanguage, theme, toggleTheme } = useAppStore()

  return (
    <footer className="bg-white dark:bg-royal-950 border-t border-gray-200 dark:border-royal-800 text-gray-700 dark:text-gray-300 mt-16 transition-colors" role="contentinfo">
      {/* Mandatory Statutory Facilitation Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-900/50 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong>Statutory Facilitation Notice:</strong> OneDesk India is an independent citizen facilitation and digital documentation assistance platform. We are <strong>NOT an official government website, authority, or affiliated with any government ministry</strong>. Direct government portals are always free and officially accessible at <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded font-bold">.gov.in</code> and <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded font-bold">.nic.in</code>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Single-window digital facilitation desk simplifying access to over 80+ Indian public portals with instant verification, tracking, and cryptographic locker attestation.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit SSL Enforced</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>DPDP Act 2023 Compliant</span>
              </span>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Citizen Directory
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-saffron transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-saffron transition-colors">
                  All 80+ Government Portals
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-saffron font-semibold text-saffron transition-colors flex items-center gap-1">
                  <span>📖 Citizen Guides & Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-saffron transition-colors">
                  ⚡ Apply Online Hub
                </Link>
              </li>
              <li>
                <Link to="/wizard" className="hover:text-saffron transition-colors">
                  🧭 Guided Service Wizard
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-gold-500 transition-colors font-medium">
                  🎨 Design System Spec
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Verification & Trust */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Trust & E-E-A-T
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-saffron transition-colors">
                  🏛️ About OneDesk India
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron transition-colors">
                  📞 Contact & Grievance Cell
                </Link>
              </li>
              <li>
                <Link to="/verify-document" className="hover:text-emerald-500 font-semibold transition-colors flex items-center gap-1">
                  <span>🛡️ Verify Document (QR)</span>
                </Link>
              </li>
              <li>
                <Link to="/scam-check" className="hover:text-saffron transition-colors">
                  🔍 Domain Scam Checker
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-amber-500 transition-colors">
                  ⚠️ Sovereign Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-saffron transition-colors">
                  📜 Refund & Transparency Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Preferences & Languages */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Language & Settings
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-royal-700 bg-gray-50 dark:bg-royal-850 hover:border-gold-500 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-gold-500" />
                  <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English (EN)'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-1.5 rounded-xl border border-gray-200 dark:border-royal-700 bg-gray-50 dark:bg-royal-850 hover:border-gold-500 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              </div>

              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed">
                Platform facilitates service applications in English & Devanagari script.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-royal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>
            © {new Date().getFullYear()} OneDesk India. Designed for sovereign citizen digital empowerment.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/privacy" className="hover:underline">
              Privacy & DPDP Notice
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">
              Terms of Facilitation
            </Link>
            <span>•</span>
            <Link to="/disclaimer" className="hover:underline">
              Sovereign Disclaimer
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:underline">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
